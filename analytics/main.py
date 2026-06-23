import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from engine.parser import parse_requirements
from engine.stats import clean_and_load_data, run_statistical_analysis
from engine.report_gen import generate_growth_report

app = FastAPI(
    title="AI Organizational Analytics Engine",
    description="Python FastAPI Microservice to run forecasts, anomalies, and explainability audits.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    org_name: str = Field(..., description="Organization Name")
    industry: str = Field(..., description="Sector / Business Type")
    size: str = Field(..., description="Employee sizing category")
    requirements: str = Field(..., description="Natural language prompt describing requirements")
    file_path: Optional[str] = Field("", description="Path to uploaded data file (CSV/Excel) if present")

@app.post("/analyze")
async def analyze_organization(payload: AnalysisRequest):
    """
    Orchestrates the statistical analysis and report generation pipeline.
    """
    try:
        print(f"Starting analysis for organization: {payload.org_name}")
        
        # 1. Parse user's descriptive requirements with Gemini
        parsed_config = parse_requirements(
            payload.requirements,
            industry_hint=payload.industry,
            size_hint=payload.size
        )
        print("Requirements successfully parsed.")

        # 2. Ingest and clean CSV/Excel file or generate simulated time-series
        df, is_simulated = clean_and_load_data(
            payload.file_path,
            industry=parsed_config.get("industry", payload.industry),
            size=parsed_config.get("size_category", payload.size)
        )
        print(f"Data loaded successfully. Simulated: {is_simulated}")

        # 3. Perform statistical calculations (Forecasting, Anomalies, Driver Weights)
        stats_results = run_statistical_analysis(df)
        print("Statistical modeling completed.")

        # 4. Generate structured report paragraphs and recommendations using Gemini
        report_results = generate_growth_report(
            {
                "org_name": payload.org_name,
                "industry": parsed_config.get("industry", payload.industry),
                "size": parsed_config.get("size_category", payload.size),
                "requirements": payload.requirements
            },
            stats_results
        )
        print("Insight report and recommendations compiled.")

        # 5. Package and return full payload
        response_payload = {
            "parsed_config": parsed_config,
            "is_simulated_data": is_simulated,
            "kpis": stats_results["kpis"],
            "charts": stats_results["charts"],
            "anomalies": stats_results["anomalies"],
            "recommendations": report_results["recommendations"],
            "report_text": report_results["report_text"]
        }
        
        print(f"Analysis pipeline successfully completed for {payload.org_name}.")
        return response_payload

    except Exception as e:
        import traceback
        print(f"Failed to execute analysis: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analytics microservice failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "Python Analytics Engine",
        "gemini_api_configured": os.environ.get("GEMINI_API_KEY") is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
