"""
Обработчик RSVP-ответов гостей свадебного приглашения.
Принимает данные формы и отправляет уведомление в Telegram.
"""

import json
import os
import urllib.request


def handler(event: dict, context) -> dict:
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": cors_headers, "body": json.dumps({"error": "Method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    attending = body.get("attending", "yes")
    guests = body.get("guests", "1")
    message = body.get("message", "").strip()

    if not name:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Name required"})}

    attending_emoji = "✅" if attending == "yes" else "❌"
    attending_text = "придёт" if attending == "yes" else "не сможет прийти"
    guests_text = f"{guests} чел." if attending == "yes" else "—"

    text = (
        f"{attending_emoji} *Новый ответ на приглашение*\n\n"
        f"👤 *Гость:* {name}\n"
        f"📋 *Статус:* {attending_text}\n"
        f"👥 *Гостей:* {guests_text}"
    )
    if message:
        text += f"\n💬 *Пожелание:* _{message}_"

    text += "\n\n_Вечер для друзей · 30 августа 2026 · «Суши весла», Киров_"

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")

    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
    }).encode("utf-8")

    req = urllib.request.Request(
        f"https://api.telegram.org/bot{bot_token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        resp.read()

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"success": True}),
    }
