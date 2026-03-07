"""
Обработчик RSVP-ответов гостей свадебного приглашения.
Принимает данные формы и отправляет письмо на konevaksenia@mail.ru
"""

import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


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

    attending_text = "✅ ПРИДЁТ" if attending == "yes" else "❌ Не сможет прийти"
    guests_text = f"{guests} чел." if attending == "yes" else "—"

    email_body = f"""
<html>
<body style="font-family: Georgia, serif; color: #3D2E22; background: #F5F0E8; padding: 32px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #DDD0B8;">
    <h2 style="font-size: 24px; font-weight: 400; font-style: italic; color: #3D2E22; margin-bottom: 8px;">
      Новый ответ на приглашение
    </h2>
    <div style="width: 60px; height: 1px; background: #C4A96A; margin-bottom: 24px;"></div>

    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
      <tr>
        <td style="padding: 10px 0; color: #6B5744; width: 140px;">Гость</td>
        <td style="padding: 10px 0; font-weight: 500;">{name}</td>
      </tr>
      <tr style="background: rgba(221,208,184,0.2);">
        <td style="padding: 10px 0; color: #6B5744;">Статус</td>
        <td style="padding: 10px 0; font-weight: 500;">{attending_text}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #6B5744;">Гостей</td>
        <td style="padding: 10px 0;">{guests_text}</td>
      </tr>
      {"<tr style='background: rgba(221,208,184,0.2);'><td style='padding: 10px 0; color: #6B5744;'>Пожелание</td><td style='padding: 10px 0; font-style: italic;'>" + message + "</td></tr>" if message else ""}
    </table>

    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #DDD0B8; font-size: 13px; color: #8A9E80;">
      Вечер для друзей · 30 августа 2026 · «Суши весла», Киров
    </div>
  </div>
</body>
</html>
"""

    smtp_password = os.environ.get("SMTP_PASSWORD", "")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"RSVP: {name} — {'придёт' if attending == 'yes' else 'не придёт'}"
    msg["From"] = "konevaksenia@mail.ru"
    msg["To"] = "konevaksenia@mail.ru"
    msg.attach(MIMEText(email_body, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login("konevaksenia@mail.ru", smtp_password)
        server.sendmail("konevaksenia@mail.ru", "konevaksenia@mail.ru", msg.as_string())

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"success": True, "message": "RSVP отправлен"}),
    }
