import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Support both ES module environment and standard process.env config
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function extractDataFromImage(imagePath, orgDescription = "") {
  if (!genAI) {
    console.warn("GEMINI_API_KEY not found. Vision extraction falling back to mock parser.");
    return getMockVisionData(orgDescription);
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash" // Using gemini-1.5-flash for speed and multi-modal compatibility
  });

  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");
  const ext = path.extname(imagePath).toLowerCase();
  const mimeMap = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".pdf": "application/pdf"
  };
  const mimeType = mimeMap[ext] || "image/jpeg";

  const prompt = `
You are a data extraction expert. Analyze this dashboard/spreadsheet/report
image and extract ALL numerical data visible.

Context: ${orgDescription}

Extract and return ONLY this JSON (no other text):
{
  "companyName": "detected name or null",
  "dashboardTool": "Power BI/Excel/Tableau/Custom/Unknown",
  "currency": "INR/USD/EUR/Unknown",
  "timeRange": "detected range or null",
  "industry": "detected industry or null",
  "metrics": [
    {
      "name": "exact metric name",
      "category": "revenue/orders/customers/operations/hr/marketing/other",
      "dataType": "time_series/single_value/percentage/breakdown",
      "unit": "INR/USD/count/percentage/minutes/score/other",
      "values": [numbers in order],
      "labels": ["Jan 2025", "Feb 2025"...],
      "confidence": 0.0 to 1.0,
      "location": "where in image this was found"
    }
  ],
  "chartsDetected": ["list of chart types"],
  "qualityNotes": "any issues with image"
}`;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType, data: base64Image } }
    ]);

    const text = result.response.text()
      .replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Vision API error:", error);
    throw new Error(`Gemini Vision processing failed: ${error.message}`);
  }
}

function getMockVisionData(orgDescription = "") {
  return {
    companyName: orgDescription ? orgDescription.split(" ")[0] : "Blinkit",
    dashboardTool: "Power BI",
    currency: "INR",
    timeRange: "12 Months",
    industry: "Retail / E-commerce",
    metrics: [
      {
        name: "Monthly Revenue",
        category: "revenue",
        dataType: "time_series",
        unit: "INR",
        values: [150000, 165000, 142000, 180000, 195000, 210000, 205000, 220000, 235000, 240000, 280000, 310000],
        labels: ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"],
        confidence: 0.95,
        location: "Top-left line graph"
      },
      {
        name: "Marketing Spend",
        category: "marketing",
        dataType: "time_series",
        unit: "INR",
        values: [40000, 42000, 38000, 45000, 48000, 52000, 50000, 53000, 55000, 58000, 85000, 92000],
        labels: ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"],
        confidence: 0.88,
        location: "Bottom-left bar chart"
      },
      {
        name: "Customer Support SLA",
        category: "operations",
        dataType: "percentage",
        unit: "percentage",
        values: [92, 94, 91, 95, 96, 95, 94, 95, 96, 97, 95, 96],
        labels: ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"],
        confidence: 0.65, // Low confidence to test UI highlight
        location: "Top-right KPI grid"
      },
      {
        name: "Product Release Speed",
        category: "operations",
        dataType: "single_value",
        unit: "score",
        values: [85],
        labels: ["Overall 2025"],
        confidence: 0.72,
        location: "Right sidebar summary stats"
      },
      {
        name: "Admin Overhead",
        category: "operations",
        dataType: "breakdown",
        unit: "INR",
        values: [24000],
        labels: ["Overall 2025"],
        confidence: 0.90,
        location: "Bottom allocation pie chart"
      }
    ],
    chartsDetected: ["Line Chart", "Bar Chart", "Pie Chart"],
    qualityNotes: "Image scanned with standard resolution. All text legible."
  };
}
