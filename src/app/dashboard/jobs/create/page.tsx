"use client";

import { useState } from "react";
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
import Step2Skills from "@/components/jobs/Step2Skills";
import Step3Workers from "@/components/jobs/Step3Workers";
import Step4LabourCosts from "@/components/jobs/Step4LabourCosts";
import Step5Dates from "@/components/jobs/Step5Dates";
import Step6TimeAndJobType from "@/components/jobs/Step6TimeAndJobType";
import Step7JobDetails from "@/components/jobs/Step7JobDetails";
import Step8PaymentSchedule from "@/components/jobs/Step8PaymentSchedule";
import type { PaymentScheduleType } from "@/components/jobs/Step8PaymentSchedule";
import Step9JobSummary from "@/components/jobs/Step9JobSummary";
import CreateJobsiteModal from "@/components/jobs/CreateJobsiteModal";

// Mock data for jobsites
const MOCK_JOBSITES = [{ id: "1", name: "333 DDDD", location: "Sydney" }];

const MOCK_SKILLS = [
  "General Labourer",
  "Carpenter",
  "Electrician",
  "Plumber",
  "Bricklayer",
  "Concreter",
  "Painter",
  "Excavator Operator",
  "Truck Driver",
  "Forklift Driver",
  "Paver Operator",
  "Truck LR Driver",
  "Asbestos Remover",
  "Elevator operator",
  "Foreman",
  "Tow Truck Driver",
  "Lawn mower",
  "Construction Foreman",
  "Bulldozer Operator",
  "Heavy Rigid Truck Driver",
  "Traffic Controller",
  "Bartender",
  "Gardener",
  "Truck HC Driver",
  "Waitress / Waiter",
  "Crane Operator - Mobile",
  "Project Manager",
  "Light Truck Driver",
  "Receptionist",
  "Warehouse Labourer",
  "Roofer",
  "Formworker",
  "Dogman",
  "Concrete Truck Driver",
  "Safety Officer",
  "Welder",
  "Truck MR Driver",
  "Pipelayer",
  "Surveyor",
  "Drill Operator",
  "Tiler",
  "Chef",
  "Compactor Operator",
  "Building Inspector",
  "Event Manager",
  "Short-Haul Truck Driver",
  "Boiler maker",
  "Tipper Truck Driver",
  "Kitchen Hand",
  "Floor Layer",
  "Barista",
  "HVAC Technician",
  "Civil Engineer",
  "Scaffolder",
  "Glazier",
  "Earthmoving",
  "Loader Operator",
  "Crane Operator",
  "Steel Fixer",
  "Other",
  "Truck HR Driver",
  "Fencer",
  "Fuel Truck Driver",
  "Alimak Operator",
  "Demolition Worker",
  "Forklift High Reach",
  "Removalist",
  "EWP Operator",
  "Backhoe Operator",
  "Site Supervisor",
  "Dump Truck Driver",
  "Runner",
  "Crane Operator - Tower",
  "Boom Lift Operator",
  "Scraper Operator",
  "Waterproofer",
  "Rigger",
  "Cleaner",
  "Handyperson",
  "testing-ux",
  "Event Staff",
  "Landscaper",
  "Excavator Spotter",
  "Long-Haul Truck Driver",
  "Plasterer",
  "Scissor Lift Operator",
  "Grader Operator",
];

export default function CreateJobPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0); // 0: Jobsites, 1: Skills
  const [selectedJobsite, setSelectedJobsite] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Step 2 state
  const [searchSkill, setSearchSkill] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Step 3 state
  const [workersAmount, setWorkersAmount] = useState<string | null>(null);
  const [isCustomAmountModalOpen, setIsCustomAmountModalOpen] = useState(false);
  const [customWorkersAmount, setCustomWorkersAmount] = useState("");

  // Step 4 state
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
  const [licensesText, setLicensesText] = useState("");
  const [description, setDescription] = useState("");

  // Step 8 state (payment schedule)
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleType | null>(null);
  const [payDay, setPayDay] = useState<Date | null>(null);

  // Step 9 state (summary)
  const [showJobPublic, setShowJobPublic] = useState(true);

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
      console.log("Submit job:", {
        jobsite: selectedJobsite,
        skill: selectedSkill,
        workers: workersAmount,
        wage,
        siteAllowance,
        leadingHandAllowance,
        productivityAllowance,
        overtimeRate,
        travelAllowance,
        startDate,
        endDate,
        isOngoing,
        workSaturdays,
        workSundays,
        startTime,
        endTime,
        jobType,
        jobRequirements,
        licensesText,
        description,
        paymentSchedule,
        payDay: paymentSchedule === "choose_pay_day" ? payDay : undefined,
        showJobPublic,
      });
      // TODO: call API to create job, then router.push("/dashboard/jobs")
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const filteredSkills = MOCK_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchSkill.toLowerCase()),
  );

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <Step1Jobsites
          jobsites={MOCK_JOBSITES}
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
          searchSkill={searchSkill}
          setSearchSkill={setSearchSkill}
          filteredSkills={filteredSkills}
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
          jobRequirements={jobRequirements}
          setJobRequirements={setJobRequirements}
          licensesText={licensesText}
          setLicensesText={setLicensesText}
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
      const jobsiteName =
        MOCK_JOBSITES.find((j) => j.id === selectedJobsite)?.name ?? selectedJobsite ?? "—";
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
