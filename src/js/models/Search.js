import axios from 'axios';
import { api } from '../apiConfig';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        
        const url = `https://api.edamam.com/search?q=${this.query}&app_id=${api.id}&app_key=${api.key}&from=${api.from}&to=${api.to}`;

        try {
            const res = await axios(url);
            this.result = res.data.hits.map(curr => curr.recipe);

        } catch (error) {
            console.error(error);
        }
    }
}



