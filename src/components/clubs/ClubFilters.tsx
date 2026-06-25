import { useState, useMemo } from "react";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Club, ClubTag } from "@/lib/types";

interface ClubFiltersProps {
  clubs: Club[];
  onFilterChange: (filtered: Club[]) => void;
}

const countries = ["Все", "Россия", "Казахстан", "Беларусь", "Узбекистан", "Азербайджан"];

const tagLabels: Record<ClubTag, string> = {
  children: "Дети",
  women: "Женщины",
  professional: "Профи",
  amateur: "Любители",
  "muay-thai": "Муай-тай",
  kickboxing: "Кикбоксинг",
  mma: "ММА",
  "fitness-boxing": "Фитнес-бокс",
  sparring: "Спарринги",
  championship: "Чемпионаты",
};

const sortOptions = [
  { value: "rating", label: "По рейтингу" },
  { value: "name", label: "По названию" },
  { value: "reviews", label: "По отзывам" },
  { value: "newest", label: "По дате" },
];

export function ClubFilters({ clubs, onFilterChange }: ClubFiltersProps) {
  const [country, setCountry] = useState("Все");
  const [selectedTags, setSelectedTags] = useState<ClubTag[]>([]);
  const [search, setSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [mobileOpen, setMobileOpen] = useState(false);

  const cities = useMemo(() => {
    const allCities = Array.from(new Set(clubs.map((c) => c.city)));
    if (!citySearch) return allCities;
    return allCities.filter((c) =>
      c.toLowerCase().includes(citySearch.toLowerCase())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citySearch]);

  const toggleTag = (tag: ClubTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const activeCount =
    (country !== "Все" ? 1 : 0) +
    selectedTags.length +
    (search ? 1 : 0) +
    (citySearch ? 1 : 0);

  const reset = () => {
    setCountry("Все");
    setSelectedTags([]);
    setSearch("");
    setCitySearch("");
    setSortBy("rating");
    onFilterChange(clubs);
  };

  return (
    <>
      <section className="bg-bg-secondary border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="hidden lg:flex items-center gap-3 flex-wrap">
            <div className="flex gap-2 flex-wrap flex-1">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                    country === c
                      ? "border-bronze text-bronze bg-bronze/10"
                      : "border-silver text-silver hover:border-bronze hover:text-bronze"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                id="club-filter-search"
                name="search"
                type="text"
                placeholder="Поиск зала..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-9 w-full text-sm"
              />
            </div>

            <select
              id="club-filter-sort"
              name="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-secondary focus:border-bronze focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-between w-full py-3"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-bronze" />
                <span className="text-sm font-medium text-text-primary">
                  Фильтры {activeCount > 0 && `(${activeCount})`}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-text-muted transition-transform",
                  mobileOpen && "rotate-180"
                )}
              />
            </button>

            {mobileOpen && (
              <div className="pb-4 space-y-4 border-t border-border pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="club-filter-search-mobile"
                    name="search"
                    type="text"
                    placeholder="Поиск зала..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-base pl-9 w-full text-sm"
                  />
                </div>

                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-2 font-mono">
                    Страна
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {countries.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCountry(c)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          country === c
                            ? "border-bronze text-bronze bg-bronze/10"
                            : "border-silver-dark text-silver hover:border-bronze"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-2 font-mono">
                    Город
                  </div>
                  <input
                    id="club-filter-city"
                    name="city"
                    type="text"
                    placeholder="Введите город..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="input-base w-full text-sm"
                  />
                  {citySearch && (
                    <div className="mt-2 max-h-40 overflow-y-auto border border-border rounded-lg bg-bg-card">
                      {cities.slice(0, 8).map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setCitySearch(city);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-bronze hover:bg-bronze/5 transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-2 font-mono">
                    Тип
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(tagLabels) as ClubTag[]).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          selectedTags.includes(tag)
                            ? "border-bronze text-bronze bg-bronze/10"
                            : "border-silver-dark text-silver hover:border-bronze"
                        )}
                      >
                        {tagLabels[tag]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <select
                    id="club-filter-sort-mobile"
                    name="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-secondary focus:border-bronze focus:outline-none"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {activeCount > 0 && (
                    <button
                      onClick={reset}
                      className="px-3 py-2 text-xs text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block max-w-7xl mx-auto px-5 pb-3">
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(tagLabels) as ClubTag[]).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                  selectedTags.includes(tag)
                    ? "border-bronze text-bronze bg-bronze/10"
                    : "border-silver-dark text-silver hover:border-bronze"
                )}
              >
                {tagLabels[tag]}
              </button>
            ))}
            {activeCount > 0 && (
              <button
                onClick={reset}
                className="flex items-center gap-1 px-3 py-1 text-xs text-error border border-error/30 rounded-full hover:bg-error/10 transition-colors"
              >
                <X className="w-3 h-3" />
                Сбросить
              </button>
            )}
          </div>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const state = { country: "Все", tags: [], search: "", city: "", sort: "rating" };

              function applyFilters() {
                const cards = document.querySelectorAll('[data-club-card]');
                let visible = 0;
                cards.forEach(card => {
                  const el = card;
                  let show = true;
                  if (state.country !== "Все" && el.dataset.country !== state.country) show = false;
                  if (state.city && !el.dataset.city?.toLowerCase().includes(state.city.toLowerCase())) show = false;
                  if (state.tags.length > 0 && !state.tags.some(t => el.dataset.tags?.includes(t))) show = false;
                  if (state.search) {
                    const q = state.search.toLowerCase();
                    const text = (el.dataset.name + " " + el.dataset.city + " " + el.dataset.description).toLowerCase();
                    if (!text.includes(q)) show = false;
                  }
                  el.style.display = show ? "" : "none";
                  if (show) visible++;
                });
                const counter = document.getElementById('clubs-count');
                if (counter) counter.textContent = visible + ' клубов';
              }

              document.addEventListener('DOMContentLoaded', applyFilters);
              window.clubFilters = { state, applyFilters };
            })();
          `,
        }}
      />
    </>
  );
}
