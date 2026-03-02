"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Import Subcomponents
import Step1Jobsites from "@/components/jobs/Step1Jobsites";
import Step2Skills, { skillDisplayLabel } from "@/components/jobs/Step2Skills";
import Step3Workers from "@/components/jobs/Step3Workers";
import Step4LabourCosts from "@/components/jobs/Step4LabourCosts";
import Step5Dates from "@/components/jobs/Step5Dates";
import Step6TimeAndJobType from "@/components/jobs/Step6TimeAndJobType";
import Step7JobDetails from "@/components/jobs/Step7JobDetails";
import Step8PaymentSchedule from "@/components/jobs/Step8PaymentSchedule";
import type { PaymentScheduleType } from "@/components/jobs/Step8PaymentSchedule";
import Step9JobSummary from "@/components/jobs/Step9JobSummary";
import CreateJobsiteModal from "@/components/jobs/CreateJobsiteModal";
import {
  GetJobsitesUseCase,
  InstitutionDashboardService,
  type JobsitesResponse,
} from "@/modules/institution";
import {
  CreateJobUseCase,
  JobsService,
  type CreateJobRequest,
} from "@/modules/jobs";
import {
  GetJobRequirementsUseCase,
  GetJobTypesUseCase,
  GetLicensesUseCase,
  GetSkillsUseCase,
  JobRequirementsService,
  JobTypesService,
  LicensesService,
  SkillsService,
  type JobRequirementsResponse,
  type JobTypesResponse,
  type LicensesResponse,
  type SkillsResponse,
} from "@/modules/masters";
import { FetchErrorState } from "@/components/FetchErrorState";

const institutionService = new InstitutionDashboardService();
const getJobsitesUseCase = new GetJobsitesUseCase(institutionService);
const skillsService = new SkillsService();
const getSkillsUseCase = new GetSkillsUseCase(skillsService);
const jobTypesService = new JobTypesService();
const getJobTypesUseCase = new GetJobTypesUseCase(jobTypesService);
const jobRequirementsService = new JobRequirementsService();
const getJobRequirementsUseCase = new GetJobRequirementsUseCase(jobRequirementsService);
const licensesService = new LicensesService();
const getLicensesUseCase = new GetLicensesUseCase(licensesService);
const jobsService = new JobsService();
const createJobUseCase = new CreateJobUseCase(jobsService);

export default function CreateJobPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0); // 0: Jobsites, 1: Skills
  const [selectedJobsite, setSelectedJobsite] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [jobsitesData, setJobsitesData] = useState<JobsitesResponse | null>(null);
  const [jobsitesLoading, setJobsitesLoading] = useState(true);
  const [jobsitesError, setJobsitesError] = useState<string | null>(null);

  const loadJobsites = useCallback(() => {
    setJobsitesError(null);
    setJobsitesLoading(true);
    getJobsitesUseCase
      .execute()
      .then(setJobsitesData)
      .catch((err) =>
        setJobsitesError(err instanceof Error ? err.message : "Failed to load jobsites")
      )
      .finally(() => setJobsitesLoading(false));
  }, []);

  const [skillsData, setSkillsData] = useState<SkillsResponse | null>(null);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);

  const loadSkills = useCallback(() => {
    setSkillsError(null);
    setSkillsLoading(true);
    getSkillsUseCase
      .execute()
      .then(setSkillsData)
      .catch((err) =>
        setSkillsError(err instanceof Error ? err.message : "Failed to load skills")
      )
      .finally(() => setSkillsLoading(false));
  }, []);

  useEffect(() => {
    if (activeStep === 0) {
      loadJobsites();
    }
  }, [activeStep, loadJobsites]);

  useEffect(() => {
    if (activeStep === 1) {
      loadSkills();
    }
  }, [activeStep, loadSkills]);

  const [jobTypesData, setJobTypesData] = useState<JobTypesResponse | null>(null);
  const [jobTypesLoading, setJobTypesLoading] = useState(false);
  const [jobTypesError, setJobTypesError] = useState<string | null>(null);

  const loadJobTypes = useCallback(() => {
    setJobTypesError(null);
    setJobTypesLoading(true);
    getJobTypesUseCase
      .execute()
      .then(setJobTypesData)
      .catch((err) =>
        setJobTypesError(err instanceof Error ? err.message : "Failed to load job types")
      )
      .finally(() => setJobTypesLoading(false));
  }, []);

  useEffect(() => {
    if (activeStep === 5) {
      loadJobTypes();
    }
  }, [activeStep, loadJobTypes]);

  const [jobRequirementsData, setJobRequirementsData] = useState<JobRequirementsResponse | null>(null);
  const [jobRequirementsLoading, setJobRequirementsLoading] = useState(false);
  const [jobRequirementsError, setJobRequirementsError] = useState<string | null>(null);

  const loadJobRequirements = useCallback(() => {
    setJobRequirementsError(null);
    setJobRequirementsLoading(true);
    getJobRequirementsUseCase
      .execute()
      .then(setJobRequirementsData)
      .catch((err) =>
        setJobRequirementsError(err instanceof Error ? err.message : "Failed to load job requirements")
      )
      .finally(() => setJobRequirementsLoading(false));
  }, []);

  const [licensesData, setLicensesData] = useState<LicensesResponse | null>(null);
  const [licensesLoading, setLicensesLoading] = useState(false);
  const [licensesError, setLicensesError] = useState<string | null>(null);

  const loadLicenses = useCallback(() => {
    setLicensesError(null);
    setLicensesLoading(true);
    getLicensesUseCase
      .execute()
      .then(setLicensesData)
      .catch((err) =>
        setLicensesError(err instanceof Error ? err.message : "Failed to load licenses")
      )
      .finally(() => setLicensesLoading(false));
  }, []);

  useEffect(() => {
    if (activeStep === 6) {
      loadJobRequirements();
      loadLicenses();
    }
  }, [activeStep, loadJobRequirements, loadLicenses]);

  // Step 2 state
  const [searchSkill, setSearchSkill] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Step 3 state
  const [workersAmount, setWorkersAmount] = useState<string | null>(null);
  const [isCustomAmountModalOpen, setIsCustomAmountModalOpen] = useState(false);
  const [customWorkersAmount, setCustomWorkersAmount] = useState("");

  // Step 4 state (all wage/cost values from Step4LabourCosts)
  const [wage, setWage] = useState<string>("28.00");
  const [siteAllowance, setSiteAllowance] = useState<string>("0.00");
  const [leadingHandAllowance, setLeadingHandAllowance] = useState<string>("0.00");
  const [productivityAllowance, setProductivityAllowance] = useState<string>("0.00");
  const [overtimeRate, setOvertimeRate] = useState<string>("0.00");
  const [travelAllowance, setTravelAllowance] = useState<string>("0.00");

  // Step 5 state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOngoing, setIsOngoing] = useState<boolean>(false);
  const [workSaturdays, setWorkSaturdays] = useState<boolean>(false);
  const [workSundays, setWorkSundays] = useState<boolean>(false);

  // Step 6 state (time + job type)
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [jobType, setJobType] = useState<string | null>(null);

  // Step 7 state (job details: requirements, licenses, description)
  const [jobRequirements, setJobRequirements] = useState<string[]>([]);
  const [licenses, setLicenses] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  // Step 8 state (payment schedule)
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleType | null>(null);
  const [payDay, setPayDay] = useState<Date | null>(null);

  // Step 9 state (summary)
  const [showJobPublic, setShowJobPublic] = useState(true);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function formatTimeToHHMMSS(date: Date | null): string {
    if (!date) return "09:00:00";
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function formatDateToISO(date: Date | null): string {
    if (!date) return new Date().toISOString();
    return date.toISOString();
  }

  function buildCreateJobPayload(): CreateJobRequest | null {
    if (!selectedJobsite || !jobType || !workersAmount || !startDate || !endDate || !paymentSchedule) return null;
    const manyLabours = parseInt(workersAmount, 10) || 1;
    const jobSkills: CreateJobRequest["job_skills"] = [];
    if (selectedSkill && skillsData?.data) {
      const cat = skillsData.data.find((c) =>
        c.subcategories.some((sub) => skillDisplayLabel(c.name, sub.name) === selectedSkill)
      );
      if (cat) {
        const sub = cat.subcategories.find((s) => skillDisplayLabel(cat.name, s.name) === selectedSkill);
        if (sub) jobSkills.push({ skill_category_id: cat.id, skill_subcategory_id: sub.id });
      }
    }
    const paymentDayDate = paymentSchedule === "choose_pay_day" ? payDay : endDate;
    // pay_type_id: replace with value from GET pay-types when available
    const payTypeIdBySchedule: Record<string, string> = {
      weekly: "00000000-0000-0000-0000-000000000001",
      fortnightly: "00000000-0000-0000-0000-000000000002",
      choose_pay_day: "00000000-0000-0000-0000-000000000003",
    };
    const pay_type_id = payTypeIdBySchedule[paymentSchedule] ?? payTypeIdBySchedule.weekly;

    // Wage/cost values from Step4LabourCosts (same parsing as in that step)
    const wageHourlyRate = parseFloat(wage) || 0;
    const gst = wageHourlyRate * 0.10 * 0.10; // 10% of Yakka Service Fee (10% of wage)

    return {
      jobsite_id: selectedJobsite,
      job_type_id: jobType,
      many_labours: manyLabours,
      ongoing_work: isOngoing,
      ongoing_frequency: "WEEKLY",
      wage_site_allowance: parseFloat(siteAllowance) || 0,
      wage_leading_hand_allowance: parseFloat(leadingHandAllowance) || 0,
      wage_productivity_allowance: parseFloat(productivityAllowance) || 0,
      wage_hourly_rate: wageHourlyRate,
      wage_meal: 0,
      travel_allowance: parseFloat(travelAllowance) || 0,
      gst: Math.round(gst * 100) / 100,
      extras_overtime_rate: parseFloat(overtimeRate) || 0,
      start_date_work: formatDateToISO(startDate),
      end_date_work: formatDateToISO(endDate),
      work_saturday: workSaturdays,
      work_sunday: workSundays,
      start_time: formatTimeToHHMMSS(startTime),
      end_time: formatTimeToHHMMSS(endTime),
      description: description || "",
      payment_day: formatDateToISO(paymentDayDate),
      requires_supervisor_signature: false,
      supervisor_name: "",
      visibility: showJobPublic ? "PUBLIC" : "PRIVATE",
      pay_type_id,
      license_ids: licenses,
      asap: false,
      job_skills: jobSkills,
      job_requirement_ids: jobRequirements,
      qualification_ids: [],
      pack_files: [],
      closing_date: formatDateToISO(endDate),
      behalf_company: true,
      location_without_company: null,
    };
  }

  const handleClose = () => {
    router.push("/dashboard/jobs");
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(3);
    } else if (activeStep === 3) {
      setActiveStep(4);
    } else if (activeStep === 4) {
      setActiveStep(5);
    } else if (activeStep === 5) {
      setActiveStep(6);
    } else if (activeStep === 6) {
      setActiveStep(7);
    } else if (activeStep === 7) {
      setActiveStep(8);
    } else if (activeStep === 8) {
      const payload = buildCreateJobPayload();
      if (!payload) {
        setSubmitError("Missing required fields.");
        return;
      }
      setSubmitError(null);
      setSubmitLoading(true);
      createJobUseCase
        .execute(payload)
        .then(() => router.push("/dashboard/jobs"))
        .catch((err) =>
          setSubmitError(err instanceof Error ? err.message : "Failed to create job")
        )
        .finally(() => setSubmitLoading(false));
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <Step1Jobsites
          company={jobsitesData?.company ?? null}
          jobsites={jobsitesData?.jobsites ?? []}
          loading={jobsitesLoading}
          error={jobsitesError}
          onRetry={loadJobsites}
          selectedJobsite={selectedJobsite}
          setSelectedJobsite={setSelectedJobsite}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onNext={handleNext}
        />
      );
    }

    if (activeStep === 1) {
      return (
        <Step2Skills
          skills={skillsData?.data ?? []}
          loading={skillsLoading}
          error={skillsError}
          onRetry={loadSkills}
          searchSkill={searchSkill}
          setSearchSkill={setSearchSkill}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          onBack={handleBack}
          onNext={handleNext}
        />
      );
    }

    if (activeStep === 2) {
      return (
        <Step3Workers
          workersAmount={workersAmount}
          setWorkersAmount={setWorkersAmount}
          setIsCustomAmountModalOpen={setIsCustomAmountModalOpen}
          onBack={handleBack}
          onNext={handleNext}
        />
      );
    }

    if (activeStep === 3) {
      return (
        <Step4LabourCosts
          onBack={handleBack}
          onNext={handleNext}
          wage={wage}
          setWage={setWage}
          siteAllowance={siteAllowance}
          setSiteAllowance={setSiteAllowance}
          leadingHandAllowance={leadingHandAllowance}
          setLeadingHandAllowance={setLeadingHandAllowance}
          productivityAllowance={productivityAllowance}
          setProductivityAllowance={setProductivityAllowance}
          overtimeRate={overtimeRate}
          setOvertimeRate={setOvertimeRate}
          travelAllowance={travelAllowance}
          setTravelAllowance={setTravelAllowance}
        />
      );
    }

    if (activeStep === 4) {
      return (
        <Step5Dates
          onBack={handleBack}
          onNext={handleNext}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          isOngoing={isOngoing}
          setIsOngoing={setIsOngoing}
          workSaturdays={workSaturdays}
          setWorkSaturdays={setWorkSaturdays}
          workSundays={workSundays}
          setWorkSundays={setWorkSundays}
        />
      );
    }

    if (activeStep === 5) {
      return (
        <Step6TimeAndJobType
          jobTypes={jobTypesData?.types ?? []}
          loading={jobTypesLoading}
          error={jobTypesError}
          onRetry={loadJobTypes}
          onBack={handleBack}
          onNext={handleNext}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          jobType={jobType}
          setJobType={setJobType}
        />
      );
    }

    if (activeStep === 6) {
      return (
        <Step7JobDetails
          onBack={handleBack}
          onNext={handleNext}
          requirements={jobRequirementsData?.requirements ?? []}
          licensesList={licensesData?.data ?? []}
          loading={jobRequirementsLoading || licensesLoading}
          error={jobRequirementsError || licensesError}
          onRetry={() => {
            loadJobRequirements();
            loadLicenses();
          }}
          jobRequirements={jobRequirements}
          setJobRequirements={setJobRequirements}
          licenses={licenses}
          setLicenses={setLicenses}
          description={description}
          setDescription={setDescription}
        />
      );
    }

    if (activeStep === 7) {
      return (
        <Step8PaymentSchedule
          onBack={handleBack}
          onNext={handleNext}
          paymentSchedule={paymentSchedule}
          setPaymentSchedule={setPaymentSchedule}
          payDay={payDay}
          setPayDay={setPayDay}
        />
      );
    }

    if (activeStep === 8) {
      const jobsite = jobsitesData?.jobsites.find((j) => j.id === selectedJobsite);
      const jobsiteName = (jobsite?.address || jobsite?.description || selectedJobsite) ?? "—";
      return (
        <Step9JobSummary
          onBack={handleBack}
          onNext={handleNext}
          jobTitle={selectedSkill ?? "—"}
          wage={wage}
          jobsiteName={jobsiteName}
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          paymentSchedule={paymentSchedule}
          payDay={payDay}
          description={description}
          showJobPublic={showJobPublic}
          setShowJobPublic={setShowJobPublic}
          onEditJobsite={() => setActiveStep(0)}
          onEditDates={() => setActiveStep(4)}
          onEditTime={() => setActiveStep(5)}
          onEditPayment={() => setActiveStep(7)}
          onEditDescription={() => setActiveStep(6)}
          submitLoading={submitLoading}
          submitError={submitError}
        />
      );
    }

    return null;
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "#ffffff",
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 1.5, sm: 2 },
          minHeight: 56,
        }}
      >
        {/* Logo Area */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Placeholder for Yakka Hexagon Logo */}
          <Box
            sx={{
              width: { xs: 24, sm: 28 },
              height: { xs: 24, sm: 28 },
              bgcolor: "#1d1d1f",
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: "6px solid #66bb6a", // Main green instead of yellow
                mt: -0.5,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "4px",
                width: "6px",
                height: "6px",
                bgcolor: "#ffffff",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 900,
              letterSpacing: "1px",
              color: "#1d1d1f",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            YAKKA SPORTY
          </Typography>
        </Box>

        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            bgcolor: "#f5f5f7",
            "&:hover": { bgcolor: "#e8e8ed" },
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
          }}
        >
          <CloseIcon sx={{ color: "#1d1d1f", fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {renderStepContent()}
      </Box>

      {/* Create Jobsite Modal */}
      <CreateJobsiteModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadJobsites}
      />

      {/* Custom Workers Amount Modal */}
      <Dialog
        open={isCustomAmountModalOpen}
        onClose={() => setIsCustomAmountModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1d1d1f" }}>
            Custom amount
          </Typography>
          <IconButton
            onClick={() => setIsCustomAmountModalOpen(false)}
            size="small"
          >
            <CloseIcon sx={{ color: "#1d1d1f" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ color: "#555555", fontSize: "0.875rem", mb: 2, mt: 1 }}
          >
            Please enter the number of labourers you need (minimum 6).
          </Typography>

          <TextField
            autoFocus
            fullWidth
            type="number"
            label="Number of labourers"
            variant="outlined"
            value={customWorkersAmount}
            onChange={(e) => setCustomWorkersAmount(e.target.value)}
            InputProps={{ inputProps: { min: 6 } }}
            sx={{
              mt: 1,
              mb: 2,
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={!customWorkersAmount || parseInt(customWorkersAmount) < 6}
            onClick={() => {
              setWorkersAmount(customWorkersAmount);
              setIsCustomAmountModalOpen(false);
            }}
            sx={{
              bgcolor: "#66bb6a",
              color: "#ffffff",
              py: 1.5,
              borderRadius: "8px",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#5cb85c",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: "#f5f5f7",
                color: "#bdbdbd",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
