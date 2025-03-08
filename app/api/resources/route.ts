import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const resourceSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  subject: z.string().min(1),
  grade: z.string().min(1),
  description: z.string().min(1),
  fileUrl: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const grade = formData.get("grade") as string;
    const description = formData.get("description") as string;

    if (!file || !title || !subject || !grade || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Here you would typically upload the file to a storage service
    // For now, we'll just store the file name as the URL
    const fileUrl = `/uploads/${file.name}`;

    const resource = await prisma.resource.create({
      data: {
        title,
        subject,
        grade,
        description,
        fileUrl,
        type: file.type,
        uploadedById: session.user.id,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error creating resource:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resources = await prisma.resource.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Resource ID required", { status: 400 });
    }

    await db.resource.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
} 