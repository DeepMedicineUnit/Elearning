import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const result = await db.request().query("SELECT 1 AS test");

    return new Response(JSON.stringify({ success: true, data: result.recordset }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Database connection failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
