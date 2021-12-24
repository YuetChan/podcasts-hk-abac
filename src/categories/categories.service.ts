import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesService {

	constructor() { }

  getAllCategories(): string[] {     
    return [
      'game', 'anime', 
      'finance', 'news', 'politic',  
      'technology',
      'casual', 'travel', 'entertainment'
    ]; 
  }

}