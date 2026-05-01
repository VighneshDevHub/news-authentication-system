from typing import List, Dict, Any

def extract_queries_prompt(text: str, count: int = 3) -> str:
    return f"""
    You are a professional news analyst.
    Please extract {count} diverse and effective search queries from the following news article text to verify its accuracy.
    
    Guidelines:
    1. One query should be a concise headline summarizing the main claim.
    2. One query should target specific entities (people, places, organizations) and events mentioned.
    3. One query should be optimized for finding fact-checking reports (e.g., "fact check [claim]", "[event] debunked").
    4. Focus on unique identifiers like dates, names, and specific numbers.
    
    Article Text:
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

def extract_claims_prompt(text: str) -> str:
    return f"""
    You are a meticulous fact-checker. 
    Extract the most important factual claims from the article below. 
    Focus on specific statements that can be verified (names, dates, numbers, events).
    
    Article:
    {text}
    
    Respond strictly with a JSON object:
    {{
        "claims": [
            "Claim 1: ...",
            "Claim 2: ..."
        ],
        "category": "Politics/Tech/Health/etc."
    }}
    """

def cross_reference_claims_prompt(claims: List[str], source_articles: List[Dict[str, Any]]) -> str:
    sources_text = ""
    for i, article in enumerate(source_articles[:8]):
        content = (article.get('content') or "")[:1500]
        title = article.get('title') or 'Unknown Source'
        url = article.get('url') or 'No URL'
        sources_text += f"\n[SOURCE {i+1}]: {title} ({url})\n{content}\n"

    return f"""
    You are an expert investigative journalist. 
    Analyze the following claims against the provided source materials.
    For each claim, find supporting or contradicting evidence.
    
    Claims to verify:
    {claims}
    
    Sources:
    {sources_text}
    
    Respond strictly with a JSON object:
    {{
        "verification_results": [
            {{
                "claim": "Claim text",
                "status": "Verified/Contradicted/Unverified",
                "evidence": "Evidence from sources",
                "source_ref": "Source Title/URL"
            }}
        ]
    }}
    """

def final_verdict_prompt(original_text: str, verification_results: List[Dict[str, Any]], bias_result: Dict[str, Any]) -> str:
    return f"""
    You are a senior editor. Synthesize a final authenticity report based on the fact-checking results.
    
    Original Article:
    {original_text}
    
    Fact-Checking Results:
    {verification_results}
    
    Bias Analysis:
    {bias_result}
    
    Provide a comprehensive breakdown.
    Respond strictly with a JSON object:
    {{
        "authenticity_score": 0-100,
        "verdict_summary": "Detailed summary",
        "key_findings": ["Finding 1", "Finding 2"],
        "differences": ["Discrepancy 1"],
        "supporting_evidence": [{{ "quote": "...", "source": "..." }}],
        "score_breakdown": {{
            "factual_accuracy": 0-100,
            "source_consistency": 0-100,
            "detail_accuracy": 0-100,
            "context_accuracy": 0-100
        }},
        "relevance_score": 0-100
    }}
    """


def detect_bias_prompt(text: str) -> str:
    return f"""
    You are a professional media analyst specializing in bias detection.
    Analyze the following news article for political, emotional, or structural bias.
    
    Article Text:
    {text}
    
    Evaluate the overall bias score (0-100, where 0 is neutral and 100 is highly biased), 
    the direction of bias (e.g., left, right, center, or specific perspective), 
    types of bias (e.g., sensationalism, cherry-picking, omission), 
    loaded or emotional language used, and any missing perspectives.
    
    Respond strictly with a JSON object:
    {{
        "overall_bias_score": 0,
        "bias_direction": "string",
        "bias_types": ["type 1", "type 2"],
        "loaded_language": ["word 1", "word 2"],
        "missing_perspectives": ["perspective 1", "perspective 2"],
        "recommendation": "Brief recommendation for the reader"
    }}
    """