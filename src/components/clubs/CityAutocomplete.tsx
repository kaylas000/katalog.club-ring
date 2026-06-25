"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  searchLocations,
  getLocationById,
  type Location,
} from "@/lib/data/locations.data";

interface CityAutocompleteProps {
  value: number | null;
  onChange: (locationId: number | null) => void;
  placeholder?: string;
  className?: string;
}

export function CityAutocomplete({
  value,
  onChange,
  placeholder = "Где? (город или регион)...",
  className,
}: CityAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback((q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const results = searchLocations(q);
    setSuggestions(results);
    setOpen(results.length > 0);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    if (value) {
      const loc = getLocationById(value);
      if (loc) setQuery(loc.label);
    } else {
      setQuery("");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    setActiveIndex(-1);

    if (value && v === "") {
      onChange(null);
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(v), 250);
  };

  const selectSuggestion = (loc: Location) => {
    setQuery(loc.label);
    onChange(loc.id);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const clear = () => {
    setQuery("");
    onChange(null);
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter" && query.length >= 2) {
        e.preventDefault();
        fetchSuggestions(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        selectSuggestion(suggestions[activeIndex]);
      } else {
        const exact = suggestions.find(
          (s) => s.label.toLowerCase() === query.toLowerCase()
        );
        if (exact) selectSuggestion(exact);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Tab" && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
      const focusables = Array.from(
        document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) =>
          !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      );
      const idx = focusables.indexOf(inputRef.current!);
      const next = focusables[idx + 1];
      if (next && "focus" in next) (next as HTMLElement).focus();
    }
  };

  const kindLabel = (kind: string) => {
    switch (kind) {
      case "country": return "Страна";
      case "region": return "Регион";
      case "city": return "Город";
      case "district": return "Район";
      case "settlement": return "Нас. пункт";
      default: return kind;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          id="city-autocomplete"
          name="city"
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-base pl-9 pr-8 w-full text-sm"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-border rounded-xl shadow-xl max-h-80 overflow-y-auto z-50"
        >
          {suggestions.map((loc, i) => {
            const hint = [kindLabel(loc.kind), loc.region, loc.parentLabel]
              .filter(Boolean)
              .join(" · ");
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => selectSuggestion(loc)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "block w-full text-left px-4 py-2.5 transition-colors",
                  i === activeIndex
                    ? "bg-bronze/10 text-bronze"
                    : "text-text-secondary hover:text-bronze hover:bg-bronze/5"
                )}
              >
                <div className="text-sm">{loc.label}</div>
                <div className="text-[11px] text-text-muted">{hint}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
