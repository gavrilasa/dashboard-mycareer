BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [password] VARCHAR(max) NOT NULL,
    [role] VARCHAR(10) NOT NULL,
    [branch] NVARCHAR(1000) NOT NULL,
    [dept] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([nomorIndukKaryawan]),
    CONSTRAINT [User_nomorIndukKaryawan_key] UNIQUE NONCLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[DataKaryawan] (
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [namaKaryawan] VARCHAR(100) NOT NULL,
    [tanggalLahir] DATE NOT NULL,
    [tanggalMasukKerja] DATE NOT NULL,
    [gender] VARCHAR(10) NOT NULL,
    [personnelArea] VARCHAR(10) NOT NULL,
    [position] INT NOT NULL,
    [personnelSubarea] VARCHAR(10) NOT NULL,
    [levelPosition] VARCHAR(10) NOT NULL,
    [age] FLOAT(53) NOT NULL,
    [lengthOfService] FLOAT(53) NOT NULL,
    [pend] VARCHAR(5) NOT NULL,
    [namaSekolah] VARCHAR(100) NOT NULL,
    [namaJurusan] VARCHAR(100) NOT NULL,
    [BestEmployee] INT,
    [formFilled] INT NOT NULL,
    [questionnaire] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL,
    [lastUpdatedAt] DATETIME2,
    CONSTRAINT [PK_DataKaryawan] PRIMARY KEY CLUSTERED ([nomorIndukKaryawan]),
    CONSTRAINT [DataKaryawan_nomorIndukKaryawan_key] UNIQUE NONCLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[DataBranch] (
    [idBranch] VARCHAR(10) NOT NULL,
    [namaBranch] VARCHAR(100) NOT NULL,
    [alamat] VARCHAR(max),
    CONSTRAINT [PK_DataBranch] PRIMARY KEY CLUSTERED ([idBranch])
);

-- CreateTable
CREATE TABLE [dbo].[DataDepartment] (
    [idDepartment] VARCHAR(10) NOT NULL,
    [namaDepartment] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_DataDepartment] PRIMARY KEY CLUSTERED ([idDepartment])
);

-- CreateTable
CREATE TABLE [dbo].[DataPosition] (
    [idPosition] INT NOT NULL IDENTITY(1,1),
    [namaPosition] VARCHAR(100) NOT NULL,
    [dept] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_DataPosition] PRIMARY KEY CLUSTERED ([idPosition])
);

-- CreateTable
CREATE TABLE [dbo].[DataLevel] (
    [idLevel] VARCHAR(10) NOT NULL,
    [namaLevel] VARCHAR(50) NOT NULL,
    CONSTRAINT [PK_DataLevel] PRIMARY KEY CLUSTERED ([idLevel])
);

-- CreateTable
CREATE TABLE [dbo].[EmpCareerChoice] (
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [careerDevWill] BIT NOT NULL,
    [rotationWill] BIT,
    [crossDeptWill] BIT,
    CONSTRAINT [EmpCareerChoice_pkey] PRIMARY KEY CLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[DataCareerPlan] (
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [positionShortTerm] NVARCHAR(1000) NOT NULL,
    [positionLongTerm] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DataCareerPlan_pkey] PRIMARY KEY CLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[DataMentorWanted] (
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [namaMentor] VARCHAR(100),
    [posisiMentor] VARCHAR(100),
    [cabangMentor] VARCHAR(100),
    CONSTRAINT [DataMentorWanted_pkey] PRIMARY KEY CLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatGKM] (
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [banyakKeikutsertaan] INT,
    [posisiTertinggi] VARCHAR(50),
    CONSTRAINT [DataRiwayatGKM_pkey] PRIMARY KEY CLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatKarir] (
    [idCareerHistory] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [position] INT NOT NULL,
    [levelPosition] VARCHAR(10) NOT NULL,
    [personnelArea] VARCHAR(10) NOT NULL,
    [tanggalMulai] DATE,
    [tanggalBerakhir] DATE,
    [status] INT NOT NULL,
    [personnelSubarea] VARCHAR(10) NOT NULL,
    CONSTRAINT [DataRiwayatKarir_pkey] PRIMARY KEY CLUSTERED ([idCareerHistory])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatKepanitiaan] (
    [idRiwayatKepanitiaan] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [namaAcara] VARCHAR(100) NOT NULL,
    [namaPosisi] VARCHAR(100) NOT NULL,
    [tahunPelaksanaan] INT NOT NULL,
    CONSTRAINT [PK_DataKepanitiaan] PRIMARY KEY CLUSTERED ([idRiwayatKepanitiaan])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatOrganisasiInternal] (
    [idRiwayatOrganisasiInternal] NVARCHAR(1000) NOT NULL,
    [namaOrganisasi] VARCHAR(100) NOT NULL,
    [namaPosisi] VARCHAR(100) NOT NULL,
    [tahunMulai] INT NOT NULL,
    [tahunSelesai] INT,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_DataRiwayatOrganisasiInternal] PRIMARY KEY CLUSTERED ([idRiwayatOrganisasiInternal])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatProject] (
    [idRiwayatProject] NVARCHAR(1000) NOT NULL,
    [judulProject] VARCHAR(100) NOT NULL,
    [namaPosisi] VARCHAR(100) NOT NULL,
    [lamaKolaborasi] INT NOT NULL,
    [shortDesc] VARCHAR(max) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_DataRiwayatProject] PRIMARY KEY CLUSTERED ([idRiwayatProject])
);

-- CreateTable
CREATE TABLE [dbo].[DataTrainingWanted] (
    [idTraining] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [topikTraining] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_Table1] PRIMARY KEY CLUSTERED ([idTraining])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B61ACEA9432] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[AssessmentType] (
    [idAssessmentType] NVARCHAR(1000) NOT NULL,
    [titleAT] VARCHAR(max) NOT NULL,
    [descAT] VARCHAR(max) NOT NULL,
    [typeAT] VARCHAR(50) NOT NULL,
    [idForm] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PK_AssessmentType] PRIMARY KEY CLUSTERED ([idAssessmentType])
);

-- CreateTable
CREATE TABLE [dbo].[Forms] (
    [idForm] NVARCHAR(1000) NOT NULL,
    [titleForm] VARCHAR(max) NOT NULL,
    [descForm] VARCHAR(max) NOT NULL,
    CONSTRAINT [PK_Forms] PRIMARY KEY CLUSTERED ([idForm])
);

-- CreateTable
CREATE TABLE [dbo].[InvolvedDept] (
    [idID] NVARCHAR(1000) NOT NULL,
    [idForm] NVARCHAR(1000) NOT NULL,
    [idDepartment] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_InvolvedDept] PRIMARY KEY CLUSTERED ([idID])
);

-- CreateTable
CREATE TABLE [dbo].[InvolvedPosition] (
    [idIP] NVARCHAR(1000) NOT NULL,
    [idAssessmentType] NVARCHAR(1000) NOT NULL,
    [idPosition] INT NOT NULL,
    CONSTRAINT [PK_InvolvedPosition] PRIMARY KEY CLUSTERED ([idIP])
);

-- CreateTable
CREATE TABLE [dbo].[Questions] (
    [idQuestion] NVARCHAR(1000) NOT NULL,
    [titleQue] VARCHAR(max) NOT NULL,
    [Question] VARCHAR(max) NOT NULL,
    [idAT] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PK_Questions] PRIMARY KEY CLUSTERED ([idQuestion])
);

-- CreateTable
CREATE TABLE [dbo].[Responses] (
    [idResp] NVARCHAR(1000) NOT NULL,
    [id_form] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Responses_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_Responses] PRIMARY KEY CLUSTERED ([idResp])
);

-- CreateTable
CREATE TABLE [dbo].[Answers] (
    [idAnswer] NVARCHAR(1000) NOT NULL,
    [idResp] NVARCHAR(1000) NOT NULL,
    [idAssess] NVARCHAR(1000) NOT NULL,
    [idQuestion] NVARCHAR(1000) NOT NULL,
    [answer] INT NOT NULL,
    CONSTRAINT [PK_Responses_Questions] PRIMARY KEY CLUSTERED ([idAnswer])
);

-- CreateTable
CREATE TABLE [dbo].[CareerPath] (
    [idCP] NVARCHAR(1000) NOT NULL,
    [existing] INT NOT NULL,
    [future] INT NOT NULL,
    CONSTRAINT [PK_CareerPath] PRIMARY KEY CLUSTERED ([idCP])
);

-- CreateTable
CREATE TABLE [dbo].[DataSupervisors] (
    [idSV] NVARCHAR(1000) NOT NULL,
    [personnelArea] VARCHAR(10) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [namaKaryawan] VARCHAR(100) NOT NULL,
    [position] INT NOT NULL,
    [personnelSubarea] VARCHAR(10) NOT NULL,
    [levelPosition] VARCHAR(10) NOT NULL,
    [tanggalMasukKerja] DATE NOT NULL,
    [tanggalLahir] DATE NOT NULL,
    [gender] VARCHAR(10) NOT NULL,
    [age] FLOAT(53) NOT NULL,
    [tahunPensiun] DATETIME2 NOT NULL,
    [lengthOfService] FLOAT(53) NOT NULL,
    CONSTRAINT [PK_DataSupervisors] PRIMARY KEY CLUSTERED ([idSV]),
    CONSTRAINT [DataSupervisors_nomorIndukKaryawan_key] UNIQUE NONCLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[JobVacancy] (
    [idJV] NVARCHAR(1000) NOT NULL,
    [personnelArea] VARCHAR(10) NOT NULL,
    [personnelSubarea] VARCHAR(10) NOT NULL,
    [position] INT NOT NULL,
    [levelPosition] VARCHAR(10) NOT NULL,
    [available] DATETIME2 NOT NULL,
    [JobSummary] NVARCHAR(1000),
    [JobDescription] NVARCHAR(1000),
    [published] INT NOT NULL CONSTRAINT [JobVacancy_published_df] DEFAULT 1,
    CONSTRAINT [PK_JobVacancy] PRIMARY KEY CLUSTERED ([idJV])
);

-- CreateTable
CREATE TABLE [dbo].[JobInterest] (
    [idJI] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [idJV] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [JobInterest_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_JobInterest] PRIMARY KEY CLUSTERED ([idJI])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DataRiwayatKarir_nomorIndukKaryawan_idx] ON [dbo].[DataRiwayatKarir]([nomorIndukKaryawan]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DataRiwayatKepanitiaan_nomorIndukKaryawan_idx] ON [dbo].[DataRiwayatKepanitiaan]([nomorIndukKaryawan]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DataRiwayatOrganisasiInternal_nomorIndukKaryawan_idx] ON [dbo].[DataRiwayatOrganisasiInternal]([nomorIndukKaryawan]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DataRiwayatProject_nomorIndukKaryawan_idx] ON [dbo].[DataRiwayatProject]([nomorIndukKaryawan]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DataTrainingWanted_nomorIndukKaryawan_idx] ON [dbo].[DataTrainingWanted]([nomorIndukKaryawan]);

-- AddForeignKey
ALTER TABLE [dbo].[DataKaryawan] ADD CONSTRAINT [FK_DataKaryawan_DataBranch] FOREIGN KEY ([personnelArea]) REFERENCES [dbo].[DataBranch]([idBranch]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataKaryawan] ADD CONSTRAINT [FK_DataKaryawan_DataLevel] FOREIGN KEY ([levelPosition]) REFERENCES [dbo].[DataLevel]([idLevel]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataKaryawan] ADD CONSTRAINT [FK_DataKaryawan_DataPosition] FOREIGN KEY ([position]) REFERENCES [dbo].[DataPosition]([idPosition]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataKaryawan] ADD CONSTRAINT [DataKaryawan_nomorIndukKaryawan_fkey] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[User]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataPosition] ADD CONSTRAINT [FK_DataPosition_DataDepartment] FOREIGN KEY ([dept]) REFERENCES [dbo].[DataDepartment]([idDepartment]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EmpCareerChoice] ADD CONSTRAINT [FK_EmpCareerChoice_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataCareerPlan] ADD CONSTRAINT [FK_DataCareerPlan_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataCareerPlan] ADD CONSTRAINT [DataCareerPlan_positionShortTerm_fkey] FOREIGN KEY ([positionShortTerm]) REFERENCES [dbo].[CareerPath]([idCP]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DataCareerPlan] ADD CONSTRAINT [DataCareerPlan_positionLongTerm_fkey] FOREIGN KEY ([positionLongTerm]) REFERENCES [dbo].[CareerPath]([idCP]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DataMentorWanted] ADD CONSTRAINT [FK_DataMentorWanted_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatGKM] ADD CONSTRAINT [FK_DataRiwayatGKM_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatKarir] ADD CONSTRAINT [FK_DataRiwayatKarir_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatKepanitiaan] ADD CONSTRAINT [FK_DataRiwayatKepanitiaan_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatOrganisasiInternal] ADD CONSTRAINT [FK_DataRiwayatOrganisasiInternal_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatProject] ADD CONSTRAINT [FK_DataRiwayatProject_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataTrainingWanted] ADD CONSTRAINT [FK_DataTrainingWanted_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentType] ADD CONSTRAINT [FK_AssessmentType_Forms] FOREIGN KEY ([idForm]) REFERENCES [dbo].[Forms]([idForm]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvolvedDept] ADD CONSTRAINT [FK_InvolvedDept_DataDepartment] FOREIGN KEY ([idDepartment]) REFERENCES [dbo].[DataDepartment]([idDepartment]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvolvedDept] ADD CONSTRAINT [FK_InvolvedDept_Forms] FOREIGN KEY ([idForm]) REFERENCES [dbo].[Forms]([idForm]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvolvedPosition] ADD CONSTRAINT [FK_InvolvedPosition_AssessmentType] FOREIGN KEY ([idAssessmentType]) REFERENCES [dbo].[AssessmentType]([idAssessmentType]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvolvedPosition] ADD CONSTRAINT [FK_InvolvedPosition_DataPosition] FOREIGN KEY ([idPosition]) REFERENCES [dbo].[DataPosition]([idPosition]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Questions] ADD CONSTRAINT [FK_Questions_AssessmentType] FOREIGN KEY ([idAT]) REFERENCES [dbo].[AssessmentType]([idAssessmentType]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Responses] ADD CONSTRAINT [FK_Responses_Forms] FOREIGN KEY ([id_form]) REFERENCES [dbo].[Forms]([idForm]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Responses] ADD CONSTRAINT [FK_Responses_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Answers] ADD CONSTRAINT [FK_Responses_Questions_Responses] FOREIGN KEY ([idResp]) REFERENCES [dbo].[Responses]([idResp]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CareerPath] ADD CONSTRAINT [CareerPath_existing_fkey] FOREIGN KEY ([existing]) REFERENCES [dbo].[DataPosition]([idPosition]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CareerPath] ADD CONSTRAINT [CareerPath_future_fkey] FOREIGN KEY ([future]) REFERENCES [dbo].[DataPosition]([idPosition]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DataSupervisors] ADD CONSTRAINT [FK_DataSupervisors_DataBranch] FOREIGN KEY ([personnelArea]) REFERENCES [dbo].[DataBranch]([idBranch]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataSupervisors] ADD CONSTRAINT [FK_DataSupervisors_DataLevel] FOREIGN KEY ([levelPosition]) REFERENCES [dbo].[DataLevel]([idLevel]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataSupervisors] ADD CONSTRAINT [FK_DataSupervisors_DataPosition] FOREIGN KEY ([position]) REFERENCES [dbo].[DataPosition]([idPosition]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[JobVacancy] ADD CONSTRAINT [FK_JobVacancy_DataBranch] FOREIGN KEY ([personnelArea]) REFERENCES [dbo].[DataBranch]([idBranch]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[JobVacancy] ADD CONSTRAINT [FK_JobVacancy_DataLevel] FOREIGN KEY ([levelPosition]) REFERENCES [dbo].[DataLevel]([idLevel]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[JobVacancy] ADD CONSTRAINT [FK_JobVacancy_DataPosition] FOREIGN KEY ([position]) REFERENCES [dbo].[DataPosition]([idPosition]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[JobInterest] ADD CONSTRAINT [FK_JobInterest_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[JobInterest] ADD CONSTRAINT [FK_JobInterest_JobVacancy] FOREIGN KEY ([idJV]) REFERENCES [dbo].[JobVacancy]([idJV]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
