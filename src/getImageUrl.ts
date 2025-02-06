export default function getImageUrl(name: string) {
    return new URL(`./assets/weather-icons/${name}.svg`, import.meta.url).href;
}
