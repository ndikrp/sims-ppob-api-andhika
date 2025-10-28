FROM node:22

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl libssl-dev wget curl unzip gnupg ca-certificates \
    fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 \
    libcups2 libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxfixes3 libxrandr2 libxrender1 libxtst6 xdg-utils libvulkan1 \
    && rm -rf /var/lib/apt/lists/*

RUN wget -q -O /tmp/chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get install -y /tmp/chrome.deb \
    && rm /tmp/chrome.deb

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true" \
    PUPPETEER_DISABLE_HEADLESS_WARNING="true" \
    PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"

EXPOSE 8080

CMD ["npm", "run", "start"]
