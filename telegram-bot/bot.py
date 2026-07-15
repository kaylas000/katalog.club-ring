import asyncio
import logging
from telegram import (
    Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup,
    CallbackQuery, BotCommand
)
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    MessageHandler, filters, ContextTypes
)
from telegram.request import HTTPXRequest

BOT_TOKEN = "7668936534:AAF0L7bq9KCGWqzPvvUN7bZOxCAnDmg_2H8"
GAME_URL = "https://club-ring.ru/game"
CHANNEL_URL = "https://t.me/club_ring"
YOUTUBE_URL = "https://www.youtube.com/@club-ring"

SCREENSHOT = "https://club-ring.ru/game/screenshot.png"
COVER = "https://club-ring.ru/game/cover.png"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ===== MAIN MENU =====
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton(" ▶  ИГРАТЬ ", web_app=WebAppInfo(url=GAME_URL))],
        [
            InlineKeyboardButton("🏆 Рейтинг", callback_data="rating"),
            InlineKeyboardButton("📖 Как играть", callback_data="rules"),
        ],
        [
            InlineKeyboardButton("📺 Telegram", url=CHANNEL_URL),
            InlineKeyboardButton("🎬 YouTube", url=YOUTUBE_URL),
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    text = (
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n"
        "    <b>🥊 CLUB RING — BOXING</b>\n"
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n\n"
        "  Боксёрская игра нового поколения\n"
        "  Спрайтовая графика и физика ударов\n\n"
        "<b>  🎯 Три режима:</b>\n"
        "  ├ Тренировка на мешке\n"
        "  ├ Против компьютера\n"
        "  └ Против игрока (PvP)\n\n"
        "<b>  ⚡ 3 уровня сложности</b>\n"
        "<b>  🏆 Таблица лидеров</b>\n"
        "<b>  🌐 Русский / English</b>\n\n"
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>"
    )

    if update.callback_query:
        await update.callback_query.edit_message_media(
            media=InputMediaPhoto(media=SCREENSHOT),
            reply_markup=reply_markup,
        )
        await update.callback_query.edit_message_caption(
            caption=text, parse_mode="HTML", reply_markup=reply_markup,
        )
    else:
        await update.message.reply_photo(
            photo=SCREENSHOT,
            caption=text,
            parse_mode="HTML",
            reply_markup=reply_markup,
        )


# ===== CALLBACKS =====
async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "rating":
        keyboard = [
            [InlineKeyboardButton(" ▶  ИГРАТЬ ", web_app=WebAppInfo(url=GAME_URL))],
            [InlineKeyboardButton("◀️ Назад", callback_data="back")],
        ]
        text = (
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n"
            "    <b>🏆 ТАБЛИЦА ЛИДЕРОВ</b>\n"
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n\n"
            "  Соревнуйся с другими игроками!\n\n"
            "  <b>🥇 Чемпион</b> — 500+ очков\n"
            "  <b>🥈 Претендент</b> — 300+ очков\n"
            "  <b>🥉 Боец</b> — 100+ очков\n"
            "  <b>👊 Новичок</b> — 0+ очков\n\n"
            "  Побеждай AI чтобы набрать очки.\n"
            "  Чем выше сложность — тем больше очков.\n\n"
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>"
        )
        await query.edit_message_media(
            media=InputMediaPhoto(media=COVER),
        )
        await query.edit_message_caption(
            caption=text, parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )

    elif query.data == "rules":
        keyboard = [
            [InlineKeyboardButton(" ▶  ИГРАТЬ ", web_app=WebAppInfo(url=GAME_URL))],
            [InlineKeyboardButton("◀️ Назад", callback_data="back")],
        ]
        text = (
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n"
            "    <b>📖 КАК ИГРАТЬ</b>\n"
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n\n"
            "<b>  ⌨️ Управление:</b>\n"
            "  ├ <b>A/D</b> — движение\n"
            "  ├ <b>Q</b> — блок (−90% урона)\n"
            "  ├ <b>Пробел</b> — джеб\n"
            "  ├ <b>G</b> — кросс\n"
            "  └ <b>E</b> — апперкот\n\n"
            "<b>  🎯 Цель:</b>\n"
            "  Выиграть 3 раунда по 99 сек.\n"
            "  Победа по очкам или нокауту.\n\n"
            "<b>  💡 Советы:</b>\n"
            "  • Чередуйте удары\n"
            "  • Блокируйте вовремя\n"
            "  • Апперкот — макс. урон\n"
            "  • Не тратьте выносливость\n\n"
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>"
        )
        await query.edit_message_media(
            media=InputMediaPhoto(media=SCREENSHOT),
        )
        await query.edit_message_caption(
            caption=text, parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )

    elif query.data == "back":
        keyboard = [
            [InlineKeyboardButton(" ▶  ИГРАТЬ ", web_app=WebAppInfo(url=GAME_URL))],
            [
                InlineKeyboardButton("🏆 Рейтинг", callback_data="rating"),
                InlineKeyboardButton("📖 Как играть", callback_data="rules"),
            ],
            [
                InlineKeyboardButton("📺 Telegram", url=CHANNEL_URL),
                InlineKeyboardButton("🎬 YouTube", url=YOUTUBE_URL),
            ],
        ]
        text = (
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n"
            "    <b>🥊 CLUB RING — BOXING</b>\n"
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n\n"
            "  Боксёрская игра нового поколения\n"
            "  Спрайтовая графика и физика ударов\n\n"
            "<b>  🎯 Три режима:</b>\n"
            "  ├ Тренировка на мешке\n"
            "  ├ Против компьютера\n"
            "  └ Против игрока (PvP)\n\n"
            "<b>  ⚡ 3 уровня сложности</b>\n"
            "<b>  🏆 Таблица лидеров</b>\n"
            "<b>  🌐 Русский / English</b>\n\n"
            "<b>━━━━━━━━━━━━━━━━━━━━━</b>"
        )
        await query.edit_message_media(
            media=InputMediaPhoto(media=SCREENSHOT),
        )
        await query.edit_message_caption(
            caption=text, parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )


# ===== PLAY (text) =====
async def play_msg(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton(" ▶  ИГРАТЬ ", web_app=WebAppInfo(url=GAME_URL))],
        [
            InlineKeyboardButton("🏆 Рейтинг", callback_data="rating"),
            InlineKeyboardButton("📖 Как играть", callback_data="rules"),
        ],
    ]
    text = (
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n"
        "    <b>🥊 ГОТОВ К БОЮ?</b>\n"
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n\n"
        "  Нажми кнопку чтобы начать!\n\n"
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>"
    )
    await update.message.reply_photo(
        photo=SCREENSHOT,
        caption=text,
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )


# ===== HELP =====
async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton(" ▶  ИГРАТЬ ", web_app=WebAppInfo(url=GAME_URL))],
        [InlineKeyboardButton("◀️ Меню", callback_data="back")],
    ]
    text = (
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n"
        "    <b>❓ ПОМОЩЬ</b>\n"
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>\n\n"
        "<b>  Команды:</b>\n"
        "  /start — Главное меню\n"
        "  /play — Запустить игру\n"
        "  /rules — Правила\n"
        "  /help — Эта справка\n\n"
        "<b>━━━━━━━━━━━━━━━━━━━━━</b>"
    )
    await update.message.reply_text(
        text=text, parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )


# ===== MAIN =====
def main():
    request = HTTPXRequest(connect_timeout=30, read_timeout=30, write_timeout=30)
    app = Application.builder().token(BOT_TOKEN).request(request).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("play", play_msg))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CallbackQueryHandler(callback_handler))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, play_msg))

    async def post_init(application):
        await application.bot.set_my_commands([
            BotCommand("start", "Главное меню"),
            BotCommand("play", "Запустить игру"),
            BotCommand("rules", "Правила игры"),
            BotCommand("help", "Помощь"),
        ])

    app.post_init = post_init

    print("🥊 Club Ring Boxing Bot started!")
    app.run_polling()


if __name__ == "__main__":
    main()
