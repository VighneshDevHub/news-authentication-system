from typing import List, Dict, Any

def extract_queries_prompt(text: str, count: int = 3) -> str:
    return f"""
    You are a professional news analyst.
    Please extract {count} concise headlines or search queries from the following news article.
    Make sure each item is clear and concise, focusing on the main facts, events, places, people, organizations, and date-time.
    
    Article:
    {text}
    
    Respond strictly with a JSON object:
    {{
        "queries": [
            "query_1",
            "query_2",
            "query_3"
        ]
    }}
    """

def verify_authenticity_prompt(original_text: str, source_articles: List[Dict[str, Any]]) -> str:
    verified_contents = [
        f"{a.get('content','')}" for a in source_articles if a.get('content')
    ]
    sources_joined = " ".join(verified_contents[:3])
    return f"""
    You are professional fact-checker and news analyst.
    Compare this news article against trusted sources and analyze its authenticity.
    
    Original News Article:
    {original_text}
    
    Trusted Sources:
    {sources_joined}
    
    Analyze the factual accuracy, source consistency, detail accuracy, and context accuracy.
    
    Respond strictly with a JSON object containing:
    {{
        "authenticity_score": 0,
        "key_findings": ["finding 1", "finding 2"],
        "differences": ["difference 1", "difference 2"],
        "supporting_evidence": [{{"quote": "...", "source": "..."}}],
        "score_breakdown": {{
            "factual_accuracy": 0,
            "source_consistency": 0,
            "detail_accuracy": 0,
            "context_accuracy": 0
        }}
    }}
    """
