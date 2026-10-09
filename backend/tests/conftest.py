import os

# Settings are read when the app is imported, so fake ones must exist first.
TEST_ENV = {
    "CLIENT_URL": "http://localhost:5173",
    "REDIS_HOST": "localhost",
    "JWT_SECRET_KEY": "test-jwt-secret-key-that-is-long-enough",
    "JWT_REFRESH_SECRET": "test-refresh-secret-key-that-is-long-enough",
    "SUPABASE_URL": "https://test.supabase.co",
    "SUPABASE_KEY": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2.test",
    "OPENAI_API_KEY": "sk-test",
}
for name, value in TEST_ENV.items():
    os.environ[name] = value
