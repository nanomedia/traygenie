export const environment = {
  production: true,
  APP_TITLE: 'ID Gob.pe | Plataforma de Autenticación Digital',
  BASE_URL: '', //url del front

  BASE_URL_CORE: 'https://core-dev.idgobpe.dev.servicios.gob.pe',
  BASE_URL_CORE_SGD: 'https://core-sgd-dev.idgobpe.dev.servicios.gob.pe',
  BASE_URL_SERVICE_CORE: 'https://vq0n7zvxa4.execute-api.ca-central-1.amazonaws.com/dev',
  BASE_URL_SERVICE_CORE_SGD: 'https://mmu5ufwi9i.execute-api.ca-central-1.amazonaws.com/dev',
  BASE_URL_SERVICE_CORE_SGD_WEBSOCKET: 'https://websocket-dev.idgobpe.dev.servicios.gob.pe',
  BASE_URL_DEFAULT_REDIRECT: 'https://www.gob.pe/',

  ALLOWED_HOSTS: ['vq0n7zvxa4.execute-api.ca-central-1.amazonaws.com', 'mmu5ufwi9i.execute-api.ca-central-1.amazonaws.com', 'websocket-dev.idgobpe.dev.servicios.gob.pe'],

  RECAPTCHA_SITE_KEY: '6Ld4p2YbAAAAAKoQUaKN95ImkhpkyTyleQIBSDMS',
  ANALYTICS_ID: 'G-L73EMLT4MZ',
  TTL_CACHE: 3600,
  TTL_CODE: 3600,
  AUTH_TIME_IDLE: 60,
  AUTH_TIME_OUT: 120,
  MAX_TRIES_TO_RECAPTCHA: 2,
};
