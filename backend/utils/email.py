import logging
from html import escape

import resend

from ..config import get_settings

logger = logging.getLogger(__name__)

envVars = get_settings()
resend.api_key = envVars.RESEND_API_KEY.get_secret_value()
EMAIL_FROM = envVars.EMAIL_FROM


## The only place that talks to the email provider; tests mock this
def send_email(to: str, subject: str, html: str) -> None:
    try:
        resend.Emails.send({"from": EMAIL_FROM, "to": [to], "subject": subject, "html": html})
    except Exception:
        # Runs as a background task, so a failure can only be logged
        logger.exception("Failed to send '%s' email", subject)


def send_reset_code_email(to: str, username: str, code: str, expires_minutes: int) -> None:
    send_email(
        to,
        "Your Ironwise password reset code",
        f"<p>Hi {escape(username)},</p>"
        f"<p>Your password reset code is <strong>{code}</strong>.</p>"
        f"<p>It expires in {expires_minutes} minutes. If you didn't ask to reset your password, you can ignore this email.</p>",
    )


def send_password_changed_email(to: str, username: str) -> None:
    send_email(
        to,
        "Your Ironwise password was changed",
        f"<p>Hi {escape(username)},</p>"
        "<p>Your Ironwise password was just changed, and other devices have been signed out.</p>"
        "<p>If this wasn't you, reset your password right away from the login page.</p>",
    )
