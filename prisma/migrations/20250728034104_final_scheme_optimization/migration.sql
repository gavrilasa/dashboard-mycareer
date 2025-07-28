-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'HD', 'HR');

-- CreateEnum
CREATE TYPE "EducationDegree" AS ENUM ('SMA_SMK', 'D3', 'D4', 'S1', 'S2', 'S3');

-- CreateTable
CREATE TABLE "User" (
    "employeeId" VARCHAR(10) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeId" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "hireDate" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "personnelAreaId" VARCHAR(10) NOT NULL,
    "positionId" INTEGER NOT NULL,
    "departmentId" VARCHAR(10) NOT NULL,
    "levelId" VARCHAR(10) NOT NULL,
    "age" DOUBLE PRECISION NOT NULL,
    "lengthOfService" DOUBLE PRECISION NOT NULL,
    "educationDegree" "EducationDegree",
    "schoolName" VARCHAR(100),
    "majorName" VARCHAR(100),
    "bestEmployeeScore" INTEGER,
    "formFilledStatus" INTEGER NOT NULL,
    "questionnaireStatus" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" TEXT,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "departmentId" VARCHAR(10) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeCareerChoice" (
    "employeeId" VARCHAR(10) NOT NULL,
    "careerDevelopmentWillingness" BOOLEAN NOT NULL,
    "rotationWillingness" BOOLEAN,
    "crossDepartmentWillingness" BOOLEAN,

    CONSTRAINT "EmployeeCareerChoice_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Reason" (
    "employeeId" VARCHAR(10) NOT NULL,
    "rotationUnwillingReason" TEXT,

    CONSTRAINT "Reason_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "CareerPlan" (
    "employeeId" VARCHAR(10) NOT NULL,
    "shortTermCareerPathId" TEXT NOT NULL,
    "longTermCareerPathId" TEXT NOT NULL,

    CONSTRAINT "CareerPlan_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "MentorPreference" (
    "employeeId" VARCHAR(10) NOT NULL,
    "mentorName" VARCHAR(100),
    "mentorPosition" VARCHAR(100),
    "mentorBranch" VARCHAR(100),

    CONSTRAINT "MentorPreference_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "GkmHistory" (
    "employeeId" VARCHAR(10) NOT NULL,
    "participationCount" INTEGER,
    "highestPosition" VARCHAR(50),

    CONSTRAINT "GkmHistory_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "CareerHistory" (
    "id" TEXT NOT NULL,
    "employeeId" VARCHAR(10) NOT NULL,
    "positionId" INTEGER NOT NULL,
    "levelId" VARCHAR(10) NOT NULL,
    "personnelAreaId" VARCHAR(10) NOT NULL,
    "startDate" DATE,
    "endDate" DATE,
    "status" INTEGER NOT NULL,
    "departmentId" VARCHAR(10) NOT NULL,

    CONSTRAINT "CareerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitteeHistory" (
    "id" TEXT NOT NULL,
    "employeeId" VARCHAR(10) NOT NULL,
    "eventName" VARCHAR(100) NOT NULL,
    "positionName" VARCHAR(100) NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "CommitteeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationHistory" (
    "id" TEXT NOT NULL,
    "organizationName" VARCHAR(100) NOT NULL,
    "positionName" VARCHAR(100) NOT NULL,
    "startDate" INTEGER NOT NULL,
    "endDate" INTEGER,
    "employeeId" VARCHAR(10) NOT NULL,

    CONSTRAINT "OrganizationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectHistory" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "positionName" VARCHAR(100) NOT NULL,
    "collaborationDuration" INTEGER NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "employeeId" VARCHAR(10) NOT NULL,

    CONSTRAINT "ProjectHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPreference" (
    "id" TEXT NOT NULL,
    "employeeId" VARCHAR(10) NOT NULL,
    "topic" VARCHAR(100) NOT NULL,

    CONSTRAINT "TrainingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentType" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "formId" TEXT NOT NULL,

    CONSTRAINT "AssessmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormInvolvedLevel" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "levelId" VARCHAR(10) NOT NULL,

    CONSTRAINT "FormInvolvedLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormInvolvedDepartment" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "departmentId" VARCHAR(10) NOT NULL,

    CONSTRAINT "FormInvolvedDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentInvolvedPosition" (
    "id" TEXT NOT NULL,
    "assessmentTypeId" TEXT NOT NULL,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "AssessmentInvolvedPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "assessmentTypeId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "employeeId" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerValue" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerPath" (
    "id" TEXT NOT NULL,
    "existingPositionId" INTEGER NOT NULL,
    "futurePositionId" INTEGER NOT NULL,

    CONSTRAINT "CareerPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supervisor" (
    "id" TEXT NOT NULL,
    "employeeId" VARCHAR(10) NOT NULL,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobVacancy" (
    "id" TEXT NOT NULL,
    "personnelAreaId" VARCHAR(10) NOT NULL,
    "departmentId" VARCHAR(10) NOT NULL,
    "positionId" INTEGER NOT NULL,
    "levelId" VARCHAR(10) NOT NULL,
    "availableDate" TIMESTAMP(3) NOT NULL,
    "jobSummary" TEXT,
    "jobDescription" TEXT,
    "published" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "JobVacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobInterest" (
    "id" TEXT NOT NULL,
    "employeeId" VARCHAR(10) NOT NULL,
    "jobVacancyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Employee_personnelAreaId_idx" ON "Employee"("personnelAreaId");

-- CreateIndex
CREATE INDEX "Employee_positionId_idx" ON "Employee"("positionId");

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "Employee"("departmentId");

-- CreateIndex
CREATE INDEX "Employee_levelId_idx" ON "Employee"("levelId");

-- CreateIndex
CREATE INDEX "Position_departmentId_idx" ON "Position"("departmentId");

-- CreateIndex
CREATE INDEX "CareerPlan_shortTermCareerPathId_idx" ON "CareerPlan"("shortTermCareerPathId");

-- CreateIndex
CREATE INDEX "CareerPlan_longTermCareerPathId_idx" ON "CareerPlan"("longTermCareerPathId");

-- CreateIndex
CREATE INDEX "CareerHistory_employeeId_idx" ON "CareerHistory"("employeeId");

-- CreateIndex
CREATE INDEX "CommitteeHistory_employeeId_idx" ON "CommitteeHistory"("employeeId");

-- CreateIndex
CREATE INDEX "OrganizationHistory_employeeId_idx" ON "OrganizationHistory"("employeeId");

-- CreateIndex
CREATE INDEX "ProjectHistory_employeeId_idx" ON "ProjectHistory"("employeeId");

-- CreateIndex
CREATE INDEX "TrainingPreference_employeeId_idx" ON "TrainingPreference"("employeeId");

-- CreateIndex
CREATE INDEX "AssessmentType_formId_idx" ON "AssessmentType"("formId");

-- CreateIndex
CREATE INDEX "FormInvolvedLevel_formId_idx" ON "FormInvolvedLevel"("formId");

-- CreateIndex
CREATE INDEX "FormInvolvedLevel_levelId_idx" ON "FormInvolvedLevel"("levelId");

-- CreateIndex
CREATE INDEX "FormInvolvedDepartment_formId_idx" ON "FormInvolvedDepartment"("formId");

-- CreateIndex
CREATE INDEX "FormInvolvedDepartment_departmentId_idx" ON "FormInvolvedDepartment"("departmentId");

-- CreateIndex
CREATE INDEX "AssessmentInvolvedPosition_assessmentTypeId_idx" ON "AssessmentInvolvedPosition"("assessmentTypeId");

-- CreateIndex
CREATE INDEX "AssessmentInvolvedPosition_positionId_idx" ON "AssessmentInvolvedPosition"("positionId");

-- CreateIndex
CREATE INDEX "Question_assessmentTypeId_idx" ON "Question"("assessmentTypeId");

-- CreateIndex
CREATE INDEX "Response_formId_idx" ON "Response"("formId");

-- CreateIndex
CREATE INDEX "Response_employeeId_idx" ON "Response"("employeeId");

-- CreateIndex
CREATE INDEX "Answer_responseId_idx" ON "Answer"("responseId");

-- CreateIndex
CREATE INDEX "CareerPath_existingPositionId_idx" ON "CareerPath"("existingPositionId");

-- CreateIndex
CREATE INDEX "CareerPath_futurePositionId_idx" ON "CareerPath"("futurePositionId");

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_employeeId_key" ON "Supervisor"("employeeId");

-- CreateIndex
CREATE INDEX "JobVacancy_personnelAreaId_idx" ON "JobVacancy"("personnelAreaId");

-- CreateIndex
CREATE INDEX "JobVacancy_departmentId_idx" ON "JobVacancy"("departmentId");

-- CreateIndex
CREATE INDEX "JobVacancy_positionId_idx" ON "JobVacancy"("positionId");

-- CreateIndex
CREATE INDEX "JobVacancy_levelId_idx" ON "JobVacancy"("levelId");

-- CreateIndex
CREATE INDEX "JobInterest_employeeId_idx" ON "JobInterest"("employeeId");

-- CreateIndex
CREATE INDEX "JobInterest_jobVacancyId_idx" ON "JobInterest"("jobVacancyId");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_personnelAreaId_fkey" FOREIGN KEY ("personnelAreaId") REFERENCES "Branch"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeCareerChoice" ADD CONSTRAINT "EmployeeCareerChoice_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPlan" ADD CONSTRAINT "CareerPlan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPlan" ADD CONSTRAINT "CareerPlan_shortTermCareerPathId_fkey" FOREIGN KEY ("shortTermCareerPathId") REFERENCES "CareerPath"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CareerPlan" ADD CONSTRAINT "CareerPlan_longTermCareerPathId_fkey" FOREIGN KEY ("longTermCareerPathId") REFERENCES "CareerPath"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MentorPreference" ADD CONSTRAINT "MentorPreference_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GkmHistory" ADD CONSTRAINT "GkmHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerHistory" ADD CONSTRAINT "CareerHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeHistory" ADD CONSTRAINT "CommitteeHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationHistory" ADD CONSTRAINT "OrganizationHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectHistory" ADD CONSTRAINT "ProjectHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPreference" ADD CONSTRAINT "TrainingPreference_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentType" ADD CONSTRAINT "AssessmentType_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInvolvedLevel" ADD CONSTRAINT "FormInvolvedLevel_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInvolvedLevel" ADD CONSTRAINT "FormInvolvedLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInvolvedDepartment" ADD CONSTRAINT "FormInvolvedDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInvolvedDepartment" ADD CONSTRAINT "FormInvolvedDepartment_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentInvolvedPosition" ADD CONSTRAINT "AssessmentInvolvedPosition_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "AssessmentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentInvolvedPosition" ADD CONSTRAINT "AssessmentInvolvedPosition_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "AssessmentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_existingPositionId_fkey" FOREIGN KEY ("existingPositionId") REFERENCES "Position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_futurePositionId_fkey" FOREIGN KEY ("futurePositionId") REFERENCES "Position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Supervisor" ADD CONSTRAINT "Supervisor_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobVacancy" ADD CONSTRAINT "JobVacancy_personnelAreaId_fkey" FOREIGN KEY ("personnelAreaId") REFERENCES "Branch"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobVacancy" ADD CONSTRAINT "JobVacancy_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobVacancy" ADD CONSTRAINT "JobVacancy_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobInterest" ADD CONSTRAINT "JobInterest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobInterest" ADD CONSTRAINT "JobInterest_jobVacancyId_fkey" FOREIGN KEY ("jobVacancyId") REFERENCES "JobVacancy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
