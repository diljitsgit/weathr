export async function getLocationData(location: string) {
    const url =
        "https://geocoding-api.open-meteo.com/v1/search?name=" +
        location +
        "&count=7";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
}
