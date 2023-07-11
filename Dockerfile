# This Dockerfile is generated based on sample in the following document

FROM node:18 AS ui-build
RUN apt-get update -y && apt-get install -y nginx
COPY ./deploy/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app/web
COPY package.json /app/web/package.json
RUN npm ci

COPY . /app/web/
RUN npm run build

COPY ./deploy/start.sh .
RUN ["chmod", "+x", "./start.sh"]
CMD ["/bin/sh", "-c", "./start.sh"]