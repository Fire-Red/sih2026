import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  users,
  governmentProfiles,
  studentProfiles,
  institutionProfiles,
  industryProfiles,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  UserProfile,
  GovernmentProfileData,
  StudentProfileData,
  InstitutionProfileData,
  IndustryProfileData,
} from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UserProfile;

    if (!body || !body.firebaseUid || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: firebaseUid and email are mandatory." },
        { status: 400 }
      );
    }

    // 1. Upsert User base record
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, body.firebaseUid));

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      await db
        .update(users)
        .set({
          displayName: body.displayName ?? existingUser.displayName,
          role: body.role ?? existingUser.role,
          avatarUrl: body.avatarUrl ?? existingUser.avatarUrl,
          phone: body.phone ?? existingUser.phone,
          state: body.geoContext?.state ?? existingUser.state,
          district: body.geoContext?.district ?? existingUser.district,
          pinCode: body.geoContext?.pinCode ?? existingUser.pinCode,
          latitude: body.geoContext?.latitude ?? existingUser.latitude,
          longitude: body.geoContext?.longitude ?? existingUser.longitude,
          formattedAddress:
            body.geoContext?.formattedAddress ?? existingUser.formattedAddress,
          isOnboarded: body.isOnboarded ?? existingUser.isOnboarded,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          firebaseUid: body.firebaseUid,
          email: body.email,
          displayName: body.displayName || null,
          role: body.role || "citizen",
          avatarUrl: body.avatarUrl || null,
          phone: body.phone || null,
          state: body.geoContext?.state || null,
          district: body.geoContext?.district || null,
          pinCode: body.geoContext?.pinCode || null,
          latitude: body.geoContext?.latitude || null,
          longitude: body.geoContext?.longitude || null,
          formattedAddress: body.geoContext?.formattedAddress || null,
          isOnboarded: body.isOnboarded || false,
        })
        .returning();

      if (!newUser) {
        throw new Error("Failed to insert user record");
      }
      userId = newUser.id;
    }

    // 2. Persist Role Specific Profile
    if (body.roleProfile && userId) {
      if (body.role === "government") {
        const govData = body.roleProfile as GovernmentProfileData;
        const [existingGov] = await db
          .select()
          .from(governmentProfiles)
          .where(eq(governmentProfiles.userId, userId));

        if (existingGov) {
          await db
            .update(governmentProfiles)
            .set({
              department: govData.department,
              designation: govData.designation,
              jurisdiction: govData.jurisdiction || null,
              employeeId: govData.employeeId || null,
              officialEmail: govData.officialEmail || null,
              updatedAt: new Date(),
            })
            .where(eq(governmentProfiles.id, existingGov.id));
        } else {
          await db.insert(governmentProfiles).values({
            userId,
            department: govData.department,
            designation: govData.designation,
            jurisdiction: govData.jurisdiction || null,
            employeeId: govData.employeeId || null,
            officialEmail: govData.officialEmail || null,
          });
        }
      } else if (body.role === "student") {
        const studentData = body.roleProfile as StudentProfileData;
        const [existingStudent] = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, userId));

        if (existingStudent) {
          await db
            .update(studentProfiles)
            .set({
              institutionName: studentData.institutionName,
              aisheCode: studentData.aisheCode || null,
              department: studentData.department,
              yearOfStudy: studentData.yearOfStudy || null,
              enrollmentNumber: studentData.enrollmentNumber || null,
              skills: studentData.skills || [],
              interests: studentData.interests || [],
              portfolioUrl: studentData.portfolioUrl || null,
              updatedAt: new Date(),
            })
            .where(eq(studentProfiles.id, existingStudent.id));
        } else {
          await db.insert(studentProfiles).values({
            userId,
            institutionName: studentData.institutionName,
            aisheCode: studentData.aisheCode || null,
            department: studentData.department,
            yearOfStudy: studentData.yearOfStudy || null,
            enrollmentNumber: studentData.enrollmentNumber || null,
            skills: studentData.skills || [],
            interests: studentData.interests || [],
            portfolioUrl: studentData.portfolioUrl || null,
          });
        }
      } else if (body.role === "institution") {
        const instData = body.roleProfile as InstitutionProfileData;
        const [existingInst] = await db
          .select()
          .from(institutionProfiles)
          .where(eq(institutionProfiles.userId, userId));

        if (existingInst) {
          await db
            .update(institutionProfiles)
            .set({
              institutionName: instData.institutionName,
              aisheCode: instData.aisheCode || null,
              institutionType: instData.institutionType || null,
              departments: instData.departments || [],
              website: instData.website || null,
              officialEmail: instData.officialEmail || null,
              accreditationStatus: instData.accreditationStatus || null,
              updatedAt: new Date(),
            })
            .where(eq(institutionProfiles.id, existingInst.id));
        } else {
          await db.insert(institutionProfiles).values({
            userId,
            institutionName: instData.institutionName,
            aisheCode: instData.aisheCode || null,
            institutionType: instData.institutionType || null,
            departments: instData.departments || [],
            website: instData.website || null,
            officialEmail: instData.officialEmail || null,
            accreditationStatus: instData.accreditationStatus || null,
          });
        }
      } else if (body.role === "industry") {
        const indData = body.roleProfile as IndustryProfileData;
        const [existingInd] = await db
          .select()
          .from(industryProfiles)
          .where(eq(industryProfiles.userId, userId));

        if (existingInd) {
          await db
            .update(industryProfiles)
            .set({
              organizationName: indData.organizationName,
              organizationType: indData.organizationType || null,
              sector: indData.sector || null,
              website: indData.website || null,
              csrFocus: indData.csrFocus || null,
              contactPersonDesignation:
                indData.contactPersonDesignation || null,
              updatedAt: new Date(),
            })
            .where(eq(industryProfiles.id, existingInd.id));
        } else {
          await db.insert(industryProfiles).values({
            userId,
            organizationName: indData.organizationName,
            organizationType: indData.organizationType || null,
            sector: indData.sector || null,
            website: indData.website || null,
            csrFocus: indData.csrFocus || null,
            contactPersonDesignation:
              indData.contactPersonDesignation || null,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "User profile persisted successfully",
      userId,
      data: { ...body, id: userId },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("firebaseUid");
    const email = searchParams.get("email");

    if (!firebaseUid && !email) {
      return NextResponse.json(
        { error: "Provide either firebaseUid or email to retrieve profile" },
        { status: 400 }
      );
    }

    let userRecord;
    if (firebaseUid) {
      const [u] = await db
        .select()
        .from(users)
        .where(eq(users.firebaseUid, firebaseUid));
      userRecord = u;
    } else if (email) {
      const [u] = await db.select().from(users).where(eq(users.email, email));
      userRecord = u;
    }

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let roleProfile = null;
    if (userRecord.role === "government") {
      const [p] = await db
        .select()
        .from(governmentProfiles)
        .where(eq(governmentProfiles.userId, userRecord.id));
      roleProfile = p || null;
    } else if (userRecord.role === "student") {
      const [p] = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, userRecord.id));
      roleProfile = p || null;
    } else if (userRecord.role === "institution") {
      const [p] = await db
        .select()
        .from(institutionProfiles)
        .where(eq(institutionProfiles.userId, userRecord.id));
      roleProfile = p || null;
    } else if (userRecord.role === "industry") {
      const [p] = await db
        .select()
        .from(industryProfiles)
        .where(eq(industryProfiles.userId, userRecord.id));
      roleProfile = p || null;
    }

    const payload: UserProfile = {
      id: userRecord.id,
      firebaseUid: userRecord.firebaseUid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role: userRecord.role,
      avatarUrl: userRecord.avatarUrl,
      phone: userRecord.phone,
      isOnboarded: userRecord.isOnboarded,
      geoContext: {
        state: userRecord.state || "",
        district: userRecord.district || "",
        pinCode: userRecord.pinCode || "",
        latitude: userRecord.latitude,
        longitude: userRecord.longitude,
        formattedAddress: userRecord.formattedAddress,
      },
      roleProfile,
    };

    return NextResponse.json({ data: payload });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
