export const parseJSONObjects = (data:any) => {
    return data.map((item:any) => {
        let parsedItem = {
            ...item,
            type: null,
            value: null
        };

        try {
            parsedItem.type = JSON.parse(item.type);
        } catch (error) {
            console.error(`Error parsing 'type' for item with key '${item.key}':`, error);
        }

        try {
            parsedItem.value = JSON.parse(item.value);
        } catch (error) {
            console.error(`Error parsing 'value' for item with key '${item.key}':`, error);
        }

        return parsedItem;
    });
};
