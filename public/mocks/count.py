import json
import os

def count_articles():
    # Get the path to mock-news.json
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(script_dir, 'mock-news.json')
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            
        # Count articles (assuming the JSON structure has articles in a list)
        if isinstance(data, list):
            article_count = len(data)
        elif isinstance(data, dict) and 'articles' in data:
            article_count = len(data['articles'])
        else:
            article_count = 0
            
        print(f"Number of articles in mock-news.json: {article_count}")
        return article_count
        
    except FileNotFoundError:
        print("Error: mock-news.json file not found")
        return 0
    except json.JSONDecodeError:
        print("Error: Invalid JSON format")
        return 0

if __name__ == "__main__":
    count_articles()