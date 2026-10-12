import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { arrayUnion, arrayRemove, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await verifyAuthToken(request);
    const body = await request.json();
    const { questionId, note, tags } = body;

    if (!questionId) {
      return NextResponse.json(
        { error: "Missing questionId" },
        { status: 400 },
      );
    }

    const bookmarkRef = doc(db, "userBookmarks", authenticatedUserId);
    const bookmarkDoc = await getDoc(bookmarkRef);

    const bookmarkData = {
      questionId,
      bookmarkedAt: new Date().toISOString(),
      note: note || null,
      tags: tags || [],
    };

    if (bookmarkDoc.exists()) {
      const data = bookmarkDoc.data();
      const bookmarks = data.bookmarks || [];
      const existingIndex = bookmarks.findIndex((b: any) => b.questionId === questionId);

      if (existingIndex >= 0) {
        // Update existing bookmark
        bookmarks[existingIndex] = {
          ...bookmarks[existingIndex],
          ...bookmarkData,
        };
        await updateDoc(bookmarkRef, { bookmarks });
      } else {
        // Add new bookmark
        await updateDoc(bookmarkRef, {
          bookmarks: arrayUnion(bookmarkData),
        });
      }
    } else {
      // Create new document
      await setDoc(bookmarkRef, {
        userId: authenticatedUserId,
        bookmarks: [bookmarkData],
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error saving bookmark:", error);
    return NextResponse.json(
      { error: "Failed to save bookmark" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await verifyAuthToken(request);
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        { error: "Missing questionId" },
        { status: 400 },
      );
    }

    const bookmarkRef = doc(db, "userBookmarks", authenticatedUserId);
    const bookmarkDoc = await getDoc(bookmarkRef);

    if (bookmarkDoc.exists()) {
      const data = bookmarkDoc.data();
      const bookmarks = data.bookmarks || [];
      const updatedBookmarks = bookmarks.filter((b: any) => b.questionId !== questionId);

      await updateDoc(bookmarkRef, { bookmarks: updatedBookmarks });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await verifyAuthToken(request);
    const bookmarkRef = doc(db, "userBookmarks", authenticatedUserId);
    const bookmarkDoc = await getDoc(bookmarkRef);

    if (bookmarkDoc.exists()) {
      return NextResponse.json(bookmarkDoc.data());
    }

    return NextResponse.json({ bookmarks: [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}
