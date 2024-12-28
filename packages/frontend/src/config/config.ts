export const Config = {
  url:
    process.env.REACT_APP_DEV_MODE === "production" && process.env.REACT_APP_URL !== undefined
      ? process.env.REACT_APP_URL
      : `http://localhost:${process.env.PORT ?? 8765}`,
}
