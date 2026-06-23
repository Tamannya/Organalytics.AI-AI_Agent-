import os
import json
import google.generativeai as genai

# Setup Gemini SDK
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def parse_requirements(requirements_text: str, industry_hint: str = "", size_hint: str = "") -> dict:
    """
    Parses user natural language requirements using Gemini API.
    Returns a dictionary of structured configurations.
    """
    default_config = {
        "industry": industry_hint or "General Business",
        "size_category": size_hint or "Medium (50-250 employees)",
        "kpi_targets": ["Revenue", "Profit Margin", "Operational Efficiency"],
        "growth_goals": ["Revenue Expansion", "Margin Optimization"],
        "time_period": "12 Months"
    }

    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not found. Returning default parsed requirements.")
        return default_config

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        You are an expert business analyst. Analyze this organizational description and extract structured metadata.
        
        Organizational Description:
        "{requirements_text}"
        
        Industry Hint: "{industry_hint}"
        Size Hint: "{size_hint}"

        You MUST respond with a single valid JSON object containing exactly these keys:
        - "industry": Extracted industry type (string, e.g. "Retail", "SaaS", "Manufacturing")
        - "size_category": Size estimation (string, e.g. "Small (<50)", "Medium (50-250)", "Large (250+)")
        - "kpi_targets": List of metrics they care about (list of strings, e.g. ["Sales Growth", "Customer Retention", "Inventory Turnover"])
        - "growth_goals": List of explicit goals (list of strings, e.g. ["Increase efficiency by 15%", "Expand market share"])
        - "time_period": Time scale of interest (string, e.g. "Monthly", "Quarterly", "12 Months", "2 Years")

        Return ONLY the raw JSON string. Do not include markdown code block syntax (like ```json ... ```).
        """
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        
        # Clean potential markdown wrapping
        if text_response.startswith("```"):
            lines = text_response.splitlines()
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                text_response = "\n".join(lines[1:-1])

        parsed = json.loads(text_response)
        return parsed
    except Exception as e:
        print(f"Failed to parse requirements with Gemini: {e}. Falling back to default configuration.")
        return default_config
