import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    home: 'Home', aboutUs: 'About Us', academics: 'Academics', admission: 'Admission',
    departments: 'Departments', examination: 'Examination', faculty: 'Faculty',
    facilities: 'Facilities', gallery: 'Gallery', contactUs: 'Contact Us', applyNow: 'Apply Now',
    gdcTank: 'GDC Tank',
    heroTitle: 'Government Captain Ashfaq Shaheed Degree College Tank',
    heroDesc: 'A premier educational institution in Khyber Pakhtunkhwa, dedicated to academic excellence, character building, and career guidance.',
    applyOnline: 'Apply Online', explorePrograms: 'Explore Programs',
    latestAnnouncements: 'Latest Announcements', noticeBoard: 'Notice Board',
    viewAllAnnouncements: 'View All Announcements', admissionDesk: 'Admission Desk',
    intermediateInquiries: 'Intermediate Inquiries', bsProgramAdmissions: 'BS Program Admissions',
    admissionProcessDetails: 'Admission Process Details', welcomeMessage: 'Welcome Message',
    fromPrincipalDesk: "From the Principal's Desk", whyCasdct: 'Why CASDCT Tank?',
    distinctiveExperience: 'Providing a Distinctive Learning Experience',
    privacyPolicy: 'Privacy Policy', termsOfUse: 'Terms of Use', allRightsReserved: 'All Rights Reserved.',
    close: 'Close', activeStudents: 'Active Students', qualifiedLecturers: 'Qualified Lecturers',
    bsInterPrograms: 'BS & Inter Programs', dedicatedSupport: 'Dedicated Support',
    ourTeachingFaculty: 'Our Teaching Faculty', facultyBannerSub: 'Experienced Lecturers, Dedicated Educators',
    meetOurEducators: 'Meet Our Educators',
    facultyDescription: "Our academic team is comprised of highly qualified specialists with post-graduation and doctoral research background, focused on nurturing student development.",
    adminHod: 'Admin/HOD', department: 'Department', designation: 'Designation',
    qualifications: 'Qualifications', email: 'Email',
    examinationsRules: 'Examinations & Rules', examBannerSub: 'BISE D.I. Khan & Gomal University Affiliation',
    affiliatedSystems: 'Affiliated Systems', examinationCodeOfConduct: 'Examination Code of Conduct',
    circularDownloads: 'Circular Downloads', importantNote: 'Important Note',
    contactInfo: 'Contact Info', offeredPrograms: 'Offered Programs', quickLinks: 'Quick Links',
    address: 'Address', collegeAddressVal: 'GDC Tank, Khyber Pakhtunkhwa, Pakistan',
    adminDashboard: 'Admin Dashboard', manageNotices: 'Manage Notices', manageGallery: 'Manage Gallery',
    manageFaculty: 'Manage Faculty', admissionsList: 'Admissions List',
    studentInquiries: 'Student Inquiries', collegeInfoSettings: 'College Info / Settings',
    consoleConfig: 'Console Config', logout: 'Logout',
    intermediateHSSC: 'Intermediate (HSSC)', degreePrograms: 'Degree Programs (BS 4-Year)',
    historyBackground: 'History & Background', visionMission: 'Vision & Mission',
    fscPreMedical: 'F.Sc Pre-Medical', fscPreEngineering: 'F.Sc Pre-Engineering',
    icsComputerScience: 'ICS (Computer Science)', faArtsHumanities: 'F.A (Arts & Humanities)',
    bsComputerScience: 'BS Computer Science', bsChemistry: 'BS Chemistry',
    bsPhysics: 'BS Physics', bsEnglish: 'BS English', bsPoliticalScience: 'BS Political Science',
    viewDetails: 'View Details', exploreMajors: 'Explore Majors',
    ourAcademics: 'Our Academics', offeredAcademicPrograms: 'Offered Academic Programs',
    exploreStreams: 'Explore the various streams and study paths available for students at GDC Tank.',
    preMedicalDesc: 'Path to medical sciences, biology, and chemistry fields. High-class science labs.',
    preEngineeringDesc: 'Strong foundations in mathematics, mechanics, and physics. Path to engineering degrees.',
    icsDesc: 'Introduces programming, database management, mathematics, and computer labs.',
    faDesc: 'A comprehensive stream focusing on political science, history, and humanities.',
    bsProgramsDesc: 'Specialized majors in CS, Chemistry, Physics, English, and Political Science.',
    qualifiedFacultyTitle: 'Qualified Faculty',
    qualifiedFacultyDesc: "Our lecturers possess master's and research-level degrees, bringing years of teaching experience.",
    modernLabsTitle: 'Modern Laboratories',
    modernLabsDesc: 'Well-stocked Physics, Chemistry, Zoology, Botany, and high-tech Computer labs for practical training.',
    richLibraryTitle: 'Rich Library',
    richLibraryDesc: 'A massive library storing reference books, textbooks, magazines, and quiet study areas.',
    sportsTitle: 'Sports and Co-curriculars',
    sportsDesc: 'A spacious sports ground hosting cricket tournaments, football games, athletics, and annual sports gala.',
    disciplineTitle: 'Disciplined Atmosphere',
    disciplineDesc: 'Strict adherence to moral conduct, uniform compliance, attendance rules, and educational excellence.',
    hostelTitle: 'Hostel Facilities',
    hostelDesc: 'Secure residential space with dining services for students coming from remote areas around Tank and Waziristan.',
    admissionDeskDesc: 'Need guidance on which program to choose? Our admissions counselor team is here to help you step-by-step.',
    noticeClickHint: 'Click to view complete circular details and instructions.',
    campusFacilities: 'Campus Facilities',
    facilitiesBannerSub: 'Supporting Theoretical Learning with Practical Infrastructure',
    stateOfArt: 'State-of-the-Art Infrastructure',
    facilitiesSubDesc: 'We continually upgrade our campus facilities to meet the educational guidelines of the Higher Education Department (HED) and Gomal University.',
    computerLabTitle: 'Computer Laboratory',
    computerLabDesc: 'Our air-conditioned IT laboratory is equipped with 30+ modern core-i5/i7 computers, local networking, and high-speed DSL broadband connection. Used by ICS and BS Computer Science students for coding, databases, and general computing practices.',
    centralLibraryTitle: 'Central Library',
    centralLibraryDesc: 'A spacious and well-lit library holding over 5,000 academic books, research journals, historical books, newspapers, and curriculum textbooks. Provides study desks in a silent, learning-focused environment.',
    scienceLabsTitle: 'Science Laboratories',
    scienceLabsDesc: 'Separate, well-stocked labs for Physics, Chemistry, Zoology, and Botany. Equipped with high-quality compound microscopes, chemical reagents, electrical kits, glass tubes, and measuring devices to support intermediate and BS experiments.',
    sportsGroundTitle: 'Sports & Athletics Ground',
    sportsGroundDesc: 'Features a large grassy sports ground within the college boundary. Supports students in playing Cricket, Football, Volleyball, Badminton, and competing in the Annual Inter-College Athletic Championships.',
    hostelFacilityTitle: 'Student Hostel',
    hostelFacilityDesc: 'Provides secure, affordable residential boarding services for students arriving from remote subdivisions of Tank and South Waziristan district. Offers dining, clean drinking water, and round-the-clock security surveillance.',
    transportTitle: 'Transport Services',
    transportDesc: 'Operates student shuttle buses along major routes in Tank City and neighboring suburban areas to ensure safe, punctual transit for students and staff.',
    campusPhotoGallery: 'Campus Photo Gallery',
    galleryBannerSub: 'Moments, Milestones & Event Highlights',
    showAll: 'Show All', campus: 'Campus', sports: 'Sports',
    onlineAdmissionReg: 'Online Admission Registration', academicSession: 'Academic Session 2026-27',
    registrationSuccessful: 'Registration Successful!', yourAdmissionId: 'Your Admission Request ID',
    regDetailsSaved: 'Your registration details have been saved under the ID above. Please print this screen or write down the ID.',
    bringDocuments: 'To complete your admission, bring printed copies of your Matric result card, character certificate, domicile, and 4 passport photographs to the college admission board during college hours before the deadline.',
    submitAnotherForm: 'Submit Another Form', admissionForm: 'Admission Form',
    personalDetails: '1. Personal Details', studentName: "Student's Name (Capital Letters)",
    fatherName: "Father's Name (Capital Letters)", dateOfBirth: 'Date of Birth',
    gender: 'Gender', male: 'Male', female: 'Female', domicileDistrict: 'Domicile District',
    cnicFormB: 'CNIC / Form-B Number', activeMobile: 'Active Mobile Number',
    emailAddress: 'Email Address', residentialAddress: 'Residential Address',
    matricDetails: '2. Matric / Academic Details', matricBoard: 'Matric Board',
    matricRollNo: 'Matric Roll No', passingYear: 'Passing Year',
    obtainedMarks: 'Matric Obtained Marks', totalMarks: 'Matric Total Marks',
    programSelection: '3. Offered Programs Selection', selectProgram: 'Select Program of Choice',
    declaration: 'Declaration:',
    declarationText: 'I hereby declare that all the information provided is correct and complete to the best of my knowledge. I understand that any false statement may lead to the cancellation of my admission.',
    submitApplication: 'Submit Application',
    enterFullName: 'Enter your full name', enterFatherName: "Enter father's name",
    enterDomicile: 'Enter domicile district', enterCnic: 'Enter CNIC / Form-B number',
    enterMobile: 'Enter active mobile number', enterEmail: 'Enter your email address',
    enterAddress: 'Enter complete residential address', enterBoardName: 'Enter board name',
    enterRollNo: 'Enter matric roll number', enterPassYear: 'Enter passing year',
    enterObtainedMarks: 'Enter obtained marks', enterTotalMarks: 'Enter total marks',
  },
  ur: {
    home: '\u06c1\u0648\u0645', aboutUs: '\u06c1\u0645\u0627\u0631\u06d2 \u0628\u0627\u0631\u06d2 \u0645\u06cc\u06ba',
    academics: '\u062a\u0639\u0644\u064a\u0645\u0627\u062a', admission: '\u062f\u0627\u062e\u0644\u06c1',
    departments: '\u0634\u0639\u0628\u06c1 \u062c\u0627\u062a', examination: '\u0627\u0645\u062a\u062d\u0627\u0646\u0627\u062a',
    faculty: '\u0627\u0633\u0627\u062a\u0630\u06c1', facilities: '\u0633\u06c1\u0648\u0644\u06cc\u0627\u062a',
    gallery: '\u06af\u06cc\u0644\u0631\u06cc', contactUs: '\u0631\u0627\u0628\u0637\u06c1 \u06a9\u0631\u06cc\u06ba',
    applyNow: '\u0627\u0628\u06be\u06cc \u0627\u067e\u0644\u0627\u0626\u06cc \u06a9\u0631\u06cc\u06ba',
    gdcTank: '\u062c\u06cc \u0688\u06cc \u0633\u06cc \u0679\u0627\u0646\u06a9',
    heroTitle: '\u06af\u0648\u0631\u0646\u0645\u0646\u0679 \u06a9\u06cc\u067e\u0679\u0646 \u0627\u0634\u0641\u0627\u0642 \u0634\u06c1\u06cc\u062f \u0688\u06af\u0631\u06cc \u06a9\u0627\u0644\u062c \u0679\u0627\u0646\u06a9',
    heroDesc: '\u062e\u06cc\u0628\u0631 \u067e\u062e\u062a\u0648\u0646\u062e\u0648\u0627 \u06a9\u0627 \u0627\u06cc\u06a9 \u0645\u0645\u062a\u0627\u0632 \u062a\u0639\u0644\u06cc\u0645\u06cc \u0627\u062f\u0627\u0631\u06c1\u060c \u062c\u0648 \u062a\u0639\u0644\u06cc\u0645\u06cc \u0641\u0636\u06cc\u0644\u062a\u060c \u06a9\u0631\u062f\u0627\u0631 \u0633\u0627\u0632\u06cc \u0627\u0648\u0631 \u06a9\u06cc\u0631\u06cc\u0626\u0631 \u06a9\u06cc \u0631\u06c1\u0646\u0645\u0627\u0626\u06cc \u06a9\u06d2 \u0644\u06cc\u06d2 \u067e\u0631\u0639\u0632\u0645 \u06c1\u06d2\u06d4',
    applyOnline: '\u0622\u0646 \u0644\u0627\u0626\u0646 \u0627\u067e\u0644\u0627\u0626\u06cc \u06a9\u0631\u06cc\u06ba',
    explorePrograms: '\u067e\u0631\u0648\u06af\u0631\u0627\u0645\u0632 \u062f\u06cc\u06a9\u06be\u06cc\u06ba',
    latestAnnouncements: '\u062a\u0627\u0632\u06c1 \u062a\u0631\u06cc\u0646 \u0627\u0639\u0644\u0627\u0646\u0627\u062a',
    noticeBoard: '\u0646\u0648\u0679\u0633 \u0628\u0648\u0631\u0688',
    viewAllAnnouncements: '\u062a\u0645\u0627\u0645 \u0627\u0639\u0644\u0627\u0646\u0627\u062a \u062f\u06cc\u06a9\u06be\u06cc\u06ba',
    admissionDesk: '\u062f\u0627\u062e\u0644\u06c1 \u0688\u06cc\u0633\u06a9',
    intermediateInquiries: '\u0627\u0646\u0679\u0631\u0645\u06cc\u0688\u06cc\u0679 \u0645\u0639\u0644\u0648\u0645\u0627\u062a',
    bsProgramAdmissions: '\u0628\u06cc \u0627\u06cc \u0633 \u067e\u0631\u0648\u06af\u0631\u0627\u0645 \u062f\u0627\u062e\u0644\u06c1',
    admissionProcessDetails: '\u062f\u0627\u062e\u0644\u06c1 \u06a9\u06cc \u062a\u0641\u0635\u06cc\u0644\u0627\u062a',
    welcomeMessage: '\u067e\u06cc\u063a\u0627\u0645\u0650 \u062e\u0648\u0634 \u0622\u0645\u062f\u06cc\u062f',
    fromPrincipalDesk: '\u067e\u0631\u0646\u0633\u067e\u0644 \u06a9\u0627 \u067e\u06cc\u063a\u0627\u0645',
    whyCasdct: '\u06a9\u0627\u0644\u062c \u06a9\u0627 \u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u06cc\u0648\u06ba\u061f',
    distinctiveExperience: '\u0627\u06cc\u06a9 \u0645\u0646\u0641\u0631\u062f \u062a\u0639\u0644\u06cc\u0645\u06cc \u062a\u062c\u0631\u0628\u06c1 \u0641\u0631\u0627\u06c1\u0645 \u06a9\u0631\u0646\u0627',
    privacyPolicy: '\u0631\u0627\u0632\u062f\u0627\u0631\u06cc \u06a9\u06cc \u067e\u0627\u0644\u06cc\u0633\u06cc',
    termsOfUse: '\u0627\u0633\u062a\u0639\u0645\u0627\u0644 \u06a9\u06cc \u0634\u0631\u0627\u0626\u0637',
    allRightsReserved: '\u062c\u0645\u0644\u06c1 \u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638 \u06c1\u06cc\u06ba\u06d4',
    close: '\u0628\u0646\u062f \u06a9\u0631\u06cc\u06ba',
    activeStudents: '\u0633\u0631\u06af\u0631\u0645 \u0637\u0644\u0628\u0627\u0621',
    qualifiedLecturers: '\u0627\u06c1\u0644 \u0627\u0633\u0627\u062a\u0630\u06c1',
    bsInterPrograms: '\u0628\u06cc \u0627\u06cc \u0633 \u0627\u0648\u0631 \u0627\u0646\u0679\u0631 \u067e\u0631\u0648\u06af\u0631\u0627\u0645',
    dedicatedSupport: '\u0645\u062e\u0644\u0635\u0627\u0646\u06c1 \u062a\u0639\u0627\u0648\u0646',
    ourTeachingFaculty: '\u06c1\u0645\u0627\u0631\u0627 \u062a\u062f\u0631\u06cc\u0633\u06cc \u0639\u0645\u0644\u06c1',
    facultyBannerSub: '\u062a\u062c\u0631\u0628\u06c1 \u06a9\u0627\u0631 \u0644\u06cc\u06a9\u0686\u0631\u0631\u0632\u060c \u0633\u0631\u06af\u0631\u0645 \u0645\u0639\u0644\u0645\u06cc\u0646',
    meetOurEducators: '\u06c1\u0645\u0627\u0631\u06d2 \u0627\u0633\u0627\u062a\u0630\u06c1 \u0633\u06d2 \u0645\u0644\u06cc\u06ba',
    facultyDescription: '\u06c1\u0645\u0627\u0631\u06cc \u062a\u0639\u0644\u06cc\u0645\u06cc \u0679\u06cc\u0645 \u067e\u0648\u0633\u0679 \u06af\u0631\u06cc\u062c\u0648\u06cc\u0634\u0646 \u0627\u0648\u0631 \u0688\u0627\u06a9\u0679\u0631\u06cc\u0679 \u0631\u06cc\u0633\u0631\u0686 \u06a9\u06d2 \u067e\u0633 \u0645\u0646\u0638\u0631 \u06a9\u06d2 \u0633\u0627\u062a\u06be \u0627\u0646\u062a\u06c1\u0627\u0626\u06cc \u0642\u0627\u0628\u0644 \u0645\u0627\u06c1\u0631\u06cc\u0646 \u067e\u0631 \u0645\u0634\u062a\u0645\u0644 \u06c1\u06d2\u060c \u062c\u0648 \u0637\u0644\u0628\u0627\u0621 \u06a9\u06cc \u062a\u0631\u0628\u06cc\u062a \u067e\u0631 \u0645\u0631\u06a9\u0648\u0632 \u06c1\u06d2\u06d4',
    adminHod: '\u0627\u06cc\u0688\u0645\u0646 / \u0627\u06cc\u0686 \u0627\u0648 \u0688\u06cc',
    department: '\u0634\u0639\u0628\u06c1', designation: '\u0639\u06c1\u062f\u06c1',
    qualifications: '\u0642\u0627\u0628\u0644\u062a\u06cc\u06ba', email: '\u0627\u06cc \u0645\u06cc\u0644',
    examinationsRules: '\u0627\u0645\u062a\u062d\u0627\u0646\u0627\u062a \u0627\u0648\u0631 \u0642\u0648\u0627\u0646\u06cc\u0646',
    examBannerSub: '\u0628\u0648\u0631\u0688 \u0622\u0641 \u0627\u0646\u0679\u0631\u0645\u06cc\u0688\u06cc\u0679 \u0627\u0648\u0631 \u06af\u0648\u0645\u0644 \u06cc\u0648\u0646\u06cc\u0648\u0631\u0633\u0679\u06cc \u0627\u0644\u062d\u0627\u0642',
    affiliatedSystems: '\u0645\u0646\u0633\u0644\u06a9 \u062a\u0639\u0644\u06cc\u0645\u06cc \u0646\u0638\u0627\u0645',
    examinationCodeOfConduct: '\u0627\u0645\u062a\u062d\u0627\u0646\u06cc \u0636\u0627\u0628\u0637\u06c1 \u0627\u062e\u0644\u0627\u0642',
    circularDownloads: '\u0633\u0631\u06a9\u0648\u0644\u0631 \u0688\u0627\u0624\u0646 \u0644\u0648\u0688\u0632',
    importantNote: '\u0627\u06c1\u0645 \u0646\u0648\u0679',
    contactInfo: '\u0631\u0627\u0628\u0637\u06c1 \u06a9\u06cc \u0645\u0639\u0644\u0648\u0645\u0627\u062a',
    offeredPrograms: '\u067e\u06cc\u0634 \u06a9\u0631\u062f\u06c1 \u067e\u0631\u0648\u06af\u0631\u0627\u0645\u0632',
    quickLinks: '\u0641\u0648\u0631\u06cc \u0644\u0646\u06a9\u0633', address: '\u067e\u062a\u06c1',
    collegeAddressVal: '\u062c\u06cc \u0688\u06cc \u0633\u06cc \u0679\u0627\u0646\u06a9\u060c \u062e\u06cc\u0628\u0631 \u067e\u062e\u062a\u0648\u0646\u062e\u0648\u0627\u060c \u067e\u0627\u06a9\u0633\u062a\u0627\u0646',
    adminDashboard: '\u0627\u06cc\u0688\u0645\u0646 \u0688\u06cc\u0634 \u0628\u0648\u0631\u0688',
    manageNotices: '\u0646\u0648\u0679\u0633 \u06a9\u0627 \u0627\u0646\u062a\u0638\u0627\u0645',
    manageGallery: '\u06af\u06cc\u0644\u0631\u06cc \u06a9\u0627 \u0627\u0646\u062a\u0638\u0627\u0645',
    manageFaculty: '\u0627\u0633\u0627\u062a\u0630\u06c1 \u06a9\u0627 \u0627\u0646\u062a\u0638\u0627\u0645',
    admissionsList: '\u062f\u0627\u062e\u0644\u06c1 \u06a9\u06cc \u0641\u06c1\u0631\u0633\u062a',
    studentInquiries: '\u0637\u0644\u0628\u0627\u0621 \u06a9\u06cc \u067e\u0648\u0686\u06be \u06af\u0686\u06be',
    collegeInfoSettings: '\u06a9\u0627\u0644\u062c \u06a9\u06cc \u0645\u0639\u0644\u0648\u0645\u0627\u062a / \u062a\u0631\u062a\u06cc\u0628\u0627\u062a',
    consoleConfig: '\u06a9\u0646\u0633\u0648\u0644 \u062a\u0631\u062a\u06cc\u0628', logout: '\u0644\u0627\u06af \u0622\u0624\u0679',
    intermediateHSSC: '\u0627\u0646\u0679\u0631\u0645\u06cc\u0688\u06cc\u0679 (HSSC)',
    degreePrograms: '\u0688\u06af\u0631\u06cc \u067e\u0631\u0648\u06af\u0631\u0627\u0645\u0632 (\u0628\u06cc \u0627\u06cc \u0633 4 \u0633\u0627\u0644)',
    historyBackground: '\u062a\u0627\u0631\u06cc\u062e \u0648 \u067e\u0633 \u0645\u0646\u0638\u0631',
    visionMission: '\u0648\u0698\u0646 \u0627\u0648\u0631 \u0645\u0634\u0646',
    fscPreMedical: '\u0627\u06cc\u0641 \u0627\u06cc\u0633 \u0633\u06cc \u067e\u0631\u06cc \u0645\u06cc\u0688\u06cc\u06a9\u0644',
    fscPreEngineering: '\u0627\u06cc\u0641 \u0627\u06cc\u0633 \u0633\u06cc \u067e\u0631\u06cc \u0627\u0646\u062c\u06cc\u0646\u06cc\u0626\u0631\u0646\u06af',
    icsComputerScience: '\u0622\u0626\u06cc \u0633\u06cc \u0627\u06cc\u0633 (\u06a9\u0645\u067e\u06cc\u0648\u0679\u0631 \u0633\u0627\u0626\u0646\u0633)',
    faArtsHumanities: '\u0627\u06cc\u0641 \u0627\u06d2 (\u0622\u0631\u0679\u0633 \u0627\u0648\u0631 \u06c1\u06cc\u0648\u0645\u06cc\u0646\u06cc\u0679\u06cc\u0632)',
    bsComputerScience: '\u0628\u06cc \u0627\u06cc \u0633 \u06a9\u0645\u067e\u06cc\u0648\u0679\u0631 \u0633\u0627\u0626\u0646\u0633',
    bsChemistry: '\u0628\u06cc \u0627\u06cc \u0633 \u06a9\u06cc\u0645\u0633\u0679\u0631\u06cc',
    bsPhysics: '\u0628\u06cc \u0627\u06cc \u0633 \u0641\u0632\u06a9\u0633',
    bsEnglish: '\u0628\u06cc \u0627\u06cc \u0633 \u0627\u0646\u06af\u0631\u06cc\u0632\u06cc',
    bsPoliticalScience: '\u0628\u06cc \u0627\u06cc \u0633 \u0633\u06cc\u0627\u0633\u06cc\u0627\u062a',
    viewDetails: '\u062a\u0641\u0635\u06cc\u0644 \u062f\u06cc\u06a9\u06be\u06cc\u06ba',
    exploreMajors: '\u0645\u0632\u06cc\u062f \u062f\u06cc\u06a9\u06be\u06cc\u06ba',
    ourAcademics: '\u062a\u0639\u0644\u06cc\u0645\u06cc \u067e\u0631\u0648\u06af\u0631\u0627\u0645\u0632',
    offeredAcademicPrograms: '\u067e\u06cc\u0634 \u06a9\u0631\u062f\u06c1 \u062a\u0639\u0644\u06cc\u0645\u06cc \u067e\u0631\u0648\u06af\u0631\u0627\u0645\u0632',
    exploreStreams: '\u062c\u06cc \u0688\u06cc \u0633\u06cc \u0679\u0627\u0646\u06a9 \u0645\u06cc\u06ba \u0637\u0644\u0628\u0627\u0621 \u06a9\u06d2 \u0644\u06cc\u06d2 \u062f\u0633\u062a\u06cc\u0627\u0628 \u0645\u062e\u062a\u0644\u0641 \u0634\u0639\u0628\u06d2 \u0627\u0648\u0631 \u062a\u0639\u0644\u06cc\u0645\u06cc \u0631\u0627\u0633\u062a\u06d2 \u062f\u06cc\u06a9\u06be\u06cc\u06ba\u06d4',
    preMedicalDesc: '\u0637\u0628\u06cc \u0639\u0644\u0648\u0645\u060c \u062d\u06cc\u0627\u062a\u06cc\u0627\u062a\u060c \u0627\u0648\u0631 \u06a9\u06cc\u0645\u0633\u0679\u0631\u06cc \u06a9\u0627 \u0631\u0627\u0633\u062a\u06c1\u06d4 \u0627\u0639\u0644\u06cc\u06b0 \u0645\u0639\u06cc\u0627\u0631 \u06a9\u06cc \u0633\u0627\u0626\u0646\u0633 \u0644\u06cc\u0628\u0627\u0631\u0679\u0631\u06cc\u0627\u06ba\u06d4',
    preEngineeringDesc: '\u0631\u06cc\u0627\u0636\u06cc\u060c \u0645\u06cc\u06a9\u06cc\u0646\u06a9\u0633 \u0627\u0648\u0631 \u0637\u0628\u06cc\u0639\u06cc\u0627\u062a \u0645\u06cc\u06ba \u0645\u0636\u0628\u0648\u0637 \u0628\u0646\u06cc\u0627\u062f\u06d4 \u0627\u0646\u062c\u06cc\u0646\u06cc\u0626\u0631\u0646\u06af \u0688\u06af\u0631\u06cc\u0648\u06ba \u06a9\u0627 \u0631\u0627\u0633\u062a\u06c1\u06d4',
    icsDesc: '\u067e\u0631\u0648\u06af\u0631\u0627\u0645\u0646\u06af\u060c \u0688\u06cc\u0679\u0627 \u0628\u06cc\u0633 \u0645\u06cc\u0646\u062c\u0645\u0646\u0679\u060c \u0631\u06cc\u0627\u0636\u06cc \u0627\u0648\u0631 \u06a9\u0645\u067e\u06cc\u0648\u0679\u0631 \u0644\u06cc\u0628\u0632 \u06a9\u0627 \u062a\u0639\u0627\u0631\u0641\u06d4',
    faDesc: '\u0633\u06cc\u0627\u0633\u06cc\u0627\u062a\u060c \u062a\u0627\u0631\u06cc\u062e \u0627\u0648\u0631 \u06c1\u06cc\u0648\u0645\u06cc\u0646\u06cc\u0679\u06cc\u0632 \u067e\u0631 \u062a\u0648\u062c\u06c1 \u0645\u0631\u06a9\u0648\u0632 \u06a9\u0631\u0646\u06d2 \u0648\u0627\u0644\u0627 \u062c\u0627\u0645\u0639 \u0633\u0644\u0633\u0644\u06c1\u06d4',
    bsProgramsDesc: 'CS\u060c \u06a9\u06cc\u0645\u0633\u0679\u0631\u06cc\u060c \u0641\u0632\u06a9\u0633\u060c \u0627\u0646\u06af\u0631\u06cc\u0632\u06cc \u0627\u0648\u0631 \u0633\u06cc\u0627\u0633\u06cc\u0627\u062a \u0645\u06cc\u06ba \u062e\u0635\u0648\u0635\u06cc \u062a\u062e\u0635\u0635\u0627\u062a\u06d4',
    qualifiedFacultyTitle: '\u0627\u06c1\u0644 \u0627\u0648\u0631 \u062a\u062c\u0631\u0628\u06c1 \u06a9\u0627\u0631 \u0627\u0633\u0627\u062a\u0630\u06c1',
    qualifiedFacultyDesc: '\u06c1\u0645\u0627\u0631\u06d2 \u0644\u06cc\u06a9\u0686\u0631\u0631\u0632 \u0645\u0627\u0633\u0679\u0631\u0632 \u0627\u0648\u0631 \u062a\u062d\u0642\u06cc\u0642\u06cc \u0633\u0637\u062d \u06a9\u06cc \u0688\u06af\u0631\u06cc\u0627\u06ba \u0631\u06a9\u06be\u062a\u06d2 \u06c1\u06cc\u06ba \u0627\u0648\u0631 \u0633\u0627\u0644\u0648\u06ba \u06a9\u0627 \u062a\u062f\u0631\u06cc\u0633\u06cc \u062a\u062c\u0631\u0628\u06c1 \u0644\u06d2 \u06a9\u0631 \u0622\u062a\u06d2 \u06c1\u06cc\u06ba\u06d4',
    modernLabsTitle: '\u062c\u062f\u06cc\u062f \u062a\u062c\u0631\u0628\u06c1 \u06af\u0627\u06c1\u06cc\u06ba (\u0644\u06cc\u0628\u0627\u0631\u0679\u0631\u06cc\u0632)',
    modernLabsDesc: '\u0641\u0632\u06a9\u0633\u060c \u06a9\u06cc\u0645\u0633\u0679\u0631\u06cc\u060c \u0632\u0648\u0644\u0648\u062c\u06cc\u060c \u0628\u0627\u0679\u0646\u06cc\u060c \u0627\u0648\u0631 \u062c\u062f\u06cc\u062f \u06a9\u0645\u067e\u06cc\u0648\u0679\u0631 \u0644\u06cc\u0628\u0632 \u0639\u0645\u0644\u06cc \u062a\u0631\u0628\u06cc\u062a \u06a9\u06d2 \u0644\u06cc\u06d2 \u0645\u06a9\u0645\u0644 \u0637\u0648\u0631 \u067e\u0631 \u0622\u0631\u0627\u0633\u062a\u06c1 \u06c1\u06cc\u06ba\u06d4',
    richLibraryTitle: '\u0648\u0633\u06cc\u0639 \u06a9\u062a\u0628 \u062e\u0627\u0646\u06c1 (\u0644\u0627\u0626\u0628\u0631\u06cc\u0631\u06cc)',
    richLibraryDesc: '\u0627\u06cc\u06a9 \u0648\u0633\u06cc\u0639 \u0644\u0627\u0626\u0628\u0631\u06cc\u0631\u06cc \u062c\u0648 \u0631\u06cc\u0641\u0631\u0646\u0633 \u06a9\u062a\u0627\u0628\u06cc\u06ba\u060c \u0646\u0635\u0627\u0628\u06cc \u06a9\u062a\u0627\u0628\u06cc\u06ba\u060c \u0631\u0633\u0627\u0626\u0644 \u0627\u0648\u0631 \u067e\u0631\u0633\u06a9\u0648\u0646 \u0645\u0637\u0627\u0644\u0639\u06c1 \u06a9\u06cc \u062c\u06af\u06c1\u06cc\u06ba \u0631\u06a9\u06be\u062a\u06cc \u06c1\u06d2\u06d4',
    sportsTitle: '\u06a9\u06be\u06cc\u0644 \u0627\u0648\u0631 \u06c1\u0645 \u0646\u0635\u0627\u0628\u06cc \u0633\u0631\u06af\u0631\u0645\u06cc\u0627\u06ba',
    sportsDesc: '\u0627\u06cc\u06a9 \u06a9\u0634\u0627\u062f\u06c1 \u06a9\u06be\u06cc\u0644 \u06a9\u0627 \u0645\u06cc\u062f\u0627\u0646 \u062c\u06c1\u0627\u06ba \u06a9\u0631\u06a9\u0679 \u0679\u0648\u0631\u0646\u0627\u0645\u0646\u0679\u060c \u0641\u0679\u0628\u0627\u0644\u060c \u0627\u06cc\u062a\u06be\u0644\u06cc\u0679\u06a9\u0633 \u0627\u0648\u0631 \u0633\u0627\u0644\u0627\u0646\u06c1 \u0627\u0633\u067e\u0648\u0631\u0679\u0633 \u06af\u0627\u0644\u0627 \u0645\u0646\u0639\u0642\u062f \u06c1\u0648\u062a\u06d2 \u06c1\u06cc\u06ba\u06d4',
    disciplineTitle: '\u067e\u0631\u0648\u0642\u0627\u0631 \u062a\u0639\u0644\u06cc\u0645\u06cc \u0645\u0627\u062d\u0648\u0644 \u0648 \u0688\u0633\u067e\u0644\u0646',
    disciplineDesc: '\u0627\u062e\u0644\u0627\u0642\u06cc \u0637\u0631\u0632\u0639\u0645\u0644\u060c \u06cc\u0648\u0646\u06cc\u0641\u0627\u0631\u0645 \u06a9\u06cc \u067e\u0627\u0628\u0646\u062f\u06cc\u060c \u062d\u0627\u0636\u0631\u06cc \u06a9\u06d2 \u0642\u0648\u0627\u0646\u06cc\u0646 \u0627\u0648\u0631 \u062a\u0639\u0644\u06cc\u0645\u06cc \u0641\u0636\u06cc\u0644\u062a \u06a9\u06cc \u0633\u062e\u062a\u06cc \u0633\u06d2 \u067e\u06cc\u0631\u0648\u06cc\u06d4',
    hostelTitle: '\u06c1\u0627\u0633\u0679\u0644 \u06a9\u06cc \u0631\u06c1\u0627\u0626\u0634\u06cc \u0633\u06c1\u0648\u0644\u062a',
    hostelDesc: '\u0679\u0627\u0646\u06a9 \u0627\u0648\u0631 \u0648\u0632\u06cc\u0631\u0633\u062a\u0627\u0646 \u06a9\u06d2 \u062f\u0648\u0631 \u062f\u0631\u0627\u0632 \u0639\u0644\u0627\u0642\u0648\u06ba \u0633\u06d2 \u0622\u0646\u06d2 \u0648\u0627\u0644\u06d2 \u0637\u0644\u0628\u0627\u0621 \u06a9\u06d2 \u0644\u06cc\u06d2 \u06a9\u06be\u0627\u0646\u06d2 \u06a9\u06cc \u0633\u06c1\u0648\u0644\u062a \u06a9\u06d2 \u0633\u0627\u062a\u06be \u0645\u062d\u0641\u0648\u0638 \u0631\u06c1\u0627\u0626\u0634\u06d4',
    admissionDeskDesc: '\u06a9\u0633 \u067e\u0631\u0648\u06af\u0631\u0627\u0645 \u06a9\u0627 \u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0631\u06cc\u06ba\u061f \u06c1\u0645\u0627\u0631\u06cc \u062f\u0627\u062e\u0644\u06c1 \u0645\u0634\u0627\u0648\u0631\u062a\u06cc \u0679\u06cc\u0645 \u0622\u067e \u06a9\u06cc \u0642\u062f\u0645 \u0628\u0642\u062f\u0645 \u0645\u062f\u062f \u06a9\u06d2 \u0644\u06cc\u06d2 \u062d\u0627\u0636\u0631 \u06c1\u06d2\u06d4',
    noticeClickHint: '\u0645\u06a9\u0645\u0644 \u0633\u0631\u06a9\u0648\u0644\u0631 \u062a\u0641\u0635\u06cc\u0644\u0627\u062a \u0627\u0648\u0631 \u06c1\u062f\u0627\u06cc\u0627\u062a \u062f\u06cc\u06a9\u06be\u0646\u06d2 \u06a9\u06d2 \u0644\u06cc\u06d2 \u06a9\u0644\u06a9 \u06a9\u0631\u06cc\u06ba\u06d4',
    campusFacilities: '\u06a9\u06cc\u0645\u067e\u0633 \u06a9\u06cc \u0633\u06c1\u0648\u0644\u06cc\u0627\u062a',
    facilitiesBannerSub: '\u0646\u0638\u0631\u06cc\u0627\u062a\u06cc \u062a\u0639\u0644\u06cc\u0645 \u06a9\u0648 \u0639\u0645\u0644\u06cc \u0628\u0646\u06cc\u0627\u062f\u06cc \u0688\u06be\u0627\u0646\u0686\u06d2 \u06a9\u06d2 \u0633\u0627\u062a\u06be \u0633\u067e\u0648\u0631\u0679 \u06a9\u0631\u0646\u0627',
    stateOfArt: '\u062c\u062f\u06cc\u062f \u062a\u0631\u06cc\u0646 \u062a\u0639\u0644\u06cc\u0645\u06cc \u0628\u0646\u06cc\u0627\u062f\u06cc \u0688\u06be\u0627\u0646\u0686\u06c1',
    facilitiesSubDesc: '\u06c1\u0645 HED \u0627\u0648\u0631 \u06af\u0648\u0645\u0644 \u06cc\u0648\u0646\u06cc\u0648\u0631\u0633\u0679\u06cc \u06a9\u06cc \u062a\u0639\u0644\u06cc\u0645\u06cc \u0631\u06c1\u0646\u0645\u0627 \u0627\u0635\u0648\u0644\u0648\u06ba \u067e\u0631 \u067e\u0648\u0631\u0627 \u0627\u062a\u0631\u0646\u06d2 \u06a9\u06d2 \u0644\u06cc\u06d2 \u06a9\u06cc\u0645\u067e\u0633 \u0633\u06c1\u0648\u0644\u06cc\u0627\u062a \u0627\u067e \u06af\u0631\u06cc\u0688 \u06a9\u0631\u062a\u06d2 \u06c1\u06cc\u06ba\u06d4',
    computerLabTitle: '\u06a9\u0645\u067e\u06cc\u0648\u0679\u0631 \u0644\u06cc\u0628\u0627\u0631\u0679\u0631\u06cc',
    computerLabDesc: '\u06c1\u0645\u0627\u0631\u06cc \u0627\u06cc\u0626\u0631 \u06a9\u0646\u0688\u06cc\u0634\u0646\u0688 \u0622\u0626\u06cc \u0679\u06cc \u0644\u06cc\u0628\u0627\u0631\u0679\u0631\u06cc 30 \u0633\u06d2 \u0632\u0627\u0626\u062f \u062c\u062f\u06cc\u062f core-i5/i7 \u06a9\u0645\u067e\u06cc\u0648\u0679\u0631\u0632\u060c \u0644\u0648\u06a9\u0644 \u0646\u06cc\u0679 \u0648\u0631\u06a9\u0646\u06af \u0627\u0648\u0631 \u06c1\u0627\u0626\u06cc \u0627\u0633\u067e\u06cc\u0688 DSL \u0633\u06d2 \u0622\u0631\u0627\u0633\u062a\u06c1 \u06c1\u06d2\u06d4',
    centralLibraryTitle: '\u0645\u0631\u06a9\u0632\u06cc \u0644\u0627\u0626\u0628\u0631\u06cc\u0631\u06cc',
    centralLibraryDesc: '5,000 \u0633\u06d2 \u0632\u0627\u0626\u062f \u062a\u0639\u0644\u06cc\u0645\u06cc \u06a9\u062a\u0627\u0628\u06cc\u06ba\u060c \u062a\u062d\u0642\u06cc\u0642\u06cc \u062c\u0631\u0627\u0626\u062f \u0627\u0648\u0631 \u062e\u0627\u0645\u0648\u0634 \u0645\u0637\u0627\u0644\u0639\u06c1 \u06a9\u06cc \u062c\u06af\u06c1\u06cc\u06ba \u0641\u0631\u0627\u06c1\u0645 \u06a9\u0631\u062a\u06cc \u06c1\u06d2\u06d4',
    scienceLabsTitle: '\u0633\u0627\u0626\u0646\u0633 \u0644\u06cc\u0628\u0627\u0631\u0679\u0631\u06cc\u0627\u06ba',
    scienceLabsDesc: '\u0641\u0632\u06a9\u0633\u060c \u06a9\u06cc\u0645\u0633\u0679\u0631\u06cc\u060c \u0632\u0648\u0644\u0648\u062c\u06cc \u0627\u0648\u0631 \u0628\u0627\u0679\u0646\u06cc \u06a9\u06cc \u0627\u0644\u06af \u0627\u0644\u06af \u0644\u06cc\u0628\u0627\u0631\u0679\u0631\u06cc\u0627\u06ba \u0627\u0639\u0644\u06cc\u0670 \u0645\u0639\u06cc\u0627\u0631 \u06a9\u06d2 \u0645\u0627\u0626\u06cc\u06a9\u0631\u0648\u0633\u06a9\u0648\u067e\u060c \u06a9\u06cc\u0645\u06cc\u0627\u0626\u06cc \u0631\u06cc \u0627\u06cc\u062c\u0646\u0679\u0633\u060c \u0628\u0631\u0642\u06cc \u06a9\u0679\u0633 \u0633\u06d2 \u0622\u0631\u0627\u0633\u062a\u06c1\u06d4',
    sportsGroundTitle: '\u06a9\u06be\u06cc\u0644 \u0627\u0648\u0631 \u0627\u06cc\u062a\u06be\u0644\u06cc\u0679\u06a9\u0633 \u06af\u0631\u0627\u0624\u0646\u0688',
    sportsGroundDesc: '\u06a9\u0627\u0644\u062c \u06a9\u06d2 \u0627\u062d\u0627\u0637\u06d2 \u0645\u06cc\u06ba \u0627\u06cc\u06a9 \u0628\u0691\u0627 \u06af\u06be\u0627\u0633 \u062f\u0627\u0631 \u06a9\u06be\u06cc\u0644 \u06a9\u0627 \u0645\u06cc\u062f\u0627\u0646\u06d4 \u06a9\u0631\u06a9\u0679\u060c \u0641\u0679\u0628\u0627\u0644\u060c \u0648\u0627\u0644\u06cc \u0628\u0627\u0644\u060c \u0628\u06cc\u0688\u0645\u0646\u0679\u0646 \u06a9\u06be\u06cc\u0644\u0646\u06d2 \u06a9\u06cc \u0633\u06c1\u0648\u0644\u062a\u06d4',
    hostelFacilityTitle: '\u0637\u0644\u0628\u0627\u0621 \u06c1\u0627\u0633\u0679\u0644',
    hostelFacilityDesc: '\u0679\u0627\u0646\u06a9 \u0627\u0648\u0631 \u062c\u0646\u0648\u0628\u06cc \u0648\u0632\u06cc\u0631\u0633\u062a\u0627\u0646 \u06a9\u06d2 \u062f\u0648\u0631 \u062f\u0631\u0627\u0632 \u0636\u0644\u0648\u06ba \u0633\u06d2 \u0622\u0646\u06d2 \u0648\u0627\u0644\u06d2 \u0637\u0644\u0628\u0627\u0621 \u06a9\u06d2 \u0644\u06cc\u06d2 \u0645\u062d\u0641\u0648\u0638\u060c \u0633\u0633\u062a\u06cc \u0631\u06c1\u0627\u0626\u0634\u06cc \u0633\u06c1\u0648\u0644\u062a\u06d4',
    transportTitle: '\u0679\u0631\u0627\u0646\u0633\u067e\u0648\u0631\u0679 \u0633\u0631\u0648\u06cc\u0633\u0632',
    transportDesc: '\u0679\u0627\u0646\u06a9 \u0634\u06c1\u0631 \u06a9\u06d2 \u0627\u06c1\u0645 \u0631\u0627\u0633\u062a\u0648\u06ba \u067e\u0631 \u0637\u0644\u0628\u0627\u0621 \u06a9\u06cc \u0634\u0679\u0644 \u0628\u0633\u06cc\u06ba \u0686\u0644\u0627\u062a\u0627 \u06c1\u06d2\u06d4',
    campusPhotoGallery: '\u06a9\u06cc\u0645\u067e\u0633 \u0641\u0648\u0679\u0648 \u06af\u06cc\u0644\u0631\u06cc',
    galleryBannerSub: '\u0644\u0645\u062d\u0627\u062a\u060c \u0633\u0646\u06af\u0650 \u0645\u06cc\u0644 \u0627\u0648\u0631 \u062a\u0642\u0631\u06cc\u0628\u0627\u062a \u06a9\u06cc \u062c\u06be\u0644\u06a9\u06cc\u0627\u06ba',
    showAll: '\u0633\u0628 \u062f\u06a9\u06be\u0627\u0626\u06cc\u06ba', campus: '\u06a9\u06cc\u0645\u067e\u0633', sports: '\u06a9\u06be\u06cc\u0644',
    onlineAdmissionReg: '\u0622\u0646 \u0644\u0627\u0626\u0646 \u062f\u0627\u062e\u0644\u06c1 \u0631\u062c\u0633\u0679\u0631\u06cc\u0634\u0646',
    academicSession: '\u062a\u0639\u0644\u06cc\u0645\u06cc \u0633\u06cc\u0634\u0646 2026-27',
    registrationSuccessful: '\u0631\u062c\u0633\u0679\u0631\u06cc\u0634\u0646 \u06a9\u0627\u0645\u06cc\u0627\u0628\u0021',
    yourAdmissionId: '\u0622\u067e \u06a9\u06cc \u062f\u0627\u062e\u0644\u06c1 \u062f\u0631\u062e\u0648\u0627\u0633\u062a \u0622\u0626\u06cc \u0688\u06cc',
    regDetailsSaved: '\u0622\u067e \u06a9\u06cc \u0631\u062c\u0633\u0679\u0631\u06cc\u0634\u0646 \u06a9\u06cc \u062a\u0641\u0635\u06cc\u0644\u0627\u062a \u0645\u062d\u0641\u0648\u0638 \u06c1\u0648 \u06af\u0626\u06cc\u06c1\u06cc\u06ba\u06d4 \u0627\u0633 \u0627\u0633\u06a9\u0631\u06cc\u0646 \u06a9\u0627 \u067e\u0631\u0646\u0679 \u0644\u06cc\u06ba\u06d4',
    bringDocuments: '\u0645\u06cc\u0679\u0631\u06a9 \u0631\u0632\u0644\u0679 \u06a9\u0627\u0631\u0688\u060c \u06a9\u0631\u06cc\u06a9\u0679\u0631 \u0633\u0631\u0679\u06cc\u0641\u06cc\u06a9\u06cc\u0679\u060c \u0688\u0648\u0645\u06cc\u0633\u0627\u0626\u0644 \u0627\u0648\u0631 4 \u062a\u0635\u0627\u0648\u06cc\u0631 \u06a9\u06cc \u06a9\u0627\u067e\u06cc\u0627\u06ba \u0622\u062e\u0631\u06cc \u062a\u0627\u0631\u06cc\u062e \u0633\u06d2 \u067e\u06c1\u0644\u06d2 \u062f\u0627\u062e\u0644\u06c1 \u0628\u0648\u0631\u0688 \u0645\u06cc\u06ba \u062c\u0645\u0639 \u06a9\u0631\u0648\u0627\u0626\u06cc\u06ba\u06d4',
    submitAnotherForm: '\u062f\u0648\u0633\u0631\u0627 \u0641\u0627\u0631\u0645 \u062c\u0645\u0639 \u06a9\u0631\u0648\u0627\u0626\u06cc\u06ba',
    admissionForm: '\u062f\u0627\u062e\u0644\u06c1 \u0641\u0627\u0631\u0645',
    personalDetails: '\u06f1\u06d4 \u0630\u0627\u062a\u06cc \u062a\u0641\u0635\u06cc\u0644\u0627\u062a',
    studentName: '\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06a9\u0627 \u0646\u0627\u0645 (\u0628\u0691\u06d2 \u062d\u0631\u0648\u0641 \u0645\u06cc\u06ba)',
    fatherName: '\u0648\u0627\u0644\u062f \u06a9\u0627 \u0646\u0627\u0645 (\u0628\u0691\u06d2 \u062d\u0631\u0648\u0641 \u0645\u06cc\u06ba)',
    dateOfBirth: '\u062a\u0627\u0631\u06cc\u062e\u0650 \u067e\u06cc\u062f\u0627\u0626\u0634',
    gender: '\u0635\u0646\u0641', male: '\u0645\u0631\u062f', female: '\u0639\u0648\u0631\u062a',
    domicileDistrict: '\u0688\u0648\u0645\u06cc\u0633\u0627\u0626\u0644 \u0636\u0644\u0639',
    cnicFormB: '\u0634\u0646\u0627\u062e\u062a\u06cc \u06a9\u0627\u0631\u0688 / \u0641\u0627\u0631\u0645-B \u0646\u0645\u0628\u0631',
    activeMobile: '\u0633\u0631\u06af\u0631\u0645 \u0645\u0648\u0628\u0627\u0626\u0644 \u0646\u0645\u0628\u0631',
    emailAddress: '\u0627\u06cc \u0645\u06cc\u0644 \u0627\u06cc\u0688\u0631\u06cc\u0633',
    residentialAddress: '\u0631\u06c1\u0627\u0626\u0634\u06cc \u067e\u062a\u06c1',
    matricDetails: '\u06f2\u06d4 \u0645\u06cc\u0679\u0631\u06a9 / \u062a\u0639\u0644\u06cc\u0645\u06cc \u062a\u0641\u0635\u06cc\u0644\u0627\u062a',
    matricBoard: '\u0645\u06cc\u0679\u0631\u06a9 \u0628\u0648\u0631\u0688',
    matricRollNo: '\u0645\u06cc\u0679\u0631\u06a9 \u0631\u0648\u0644 \u0646\u0645\u0628\u0631',
    passingYear: '\u067e\u0627\u0633\u0646\u06af \u0633\u0627\u0644',
    obtainedMarks: '\u0645\u06cc\u0679\u0631\u06a9 \u062d\u0627\u0635\u0644 \u06a9\u0631\u062f\u06c1 \u0646\u0645\u0628\u0631',
    totalMarks: '\u0645\u06cc\u0679\u0631\u06a9 \u06a9\u0644 \u0646\u0645\u0628\u0631',
    programSelection: '\u06f3\u06d4 \u067e\u0631\u0648\u06af\u0631\u0627\u0645 \u06a9\u0627 \u0627\u0646\u062a\u062e\u0627\u0628',
    selectProgram: '\u0645\u0637\u0644\u0648\u0628\u06c1 \u067e\u0631\u0648\u06af\u0631\u0627\u0645 \u0645\u0646\u062a\u062e\u0628 \u06a9\u0631\u06cc\u06ba',
    declaration: '\u0627\u0642\u0631\u0627\u0631 \u0646\u0627\u0645\u06c1:',
    declarationText: '\u0645\u06cc\u06ba \u0627\u0639\u0644\u0627\u0646 \u06a9\u0631\u062a\u0627 / \u06a9\u0631\u062a\u06cc \u06c1\u0648\u06ba \u06a9\u06c1 \u0641\u0631\u0627\u06c1\u0645 \u06a9\u0631\u062f\u06c1 \u062a\u0645\u0627\u0645 \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u062f\u0631\u0633\u062a \u06c1\u06cc\u06ba\u06d4',
    submitApplication: '\u062f\u0631\u062e\u0648\u0627\u0633\u062a \u062c\u0645\u0639 \u06a9\u0631\u0648\u0627\u0626\u06cc\u06ba',
    enterFullName: '\u0627\u067e\u0646\u0627 \u0645\u06a9\u0645\u0644 \u0646\u0627\u0645 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterFatherName: '\u0648\u0627\u0644\u062f \u06a9\u0627 \u0646\u0627\u0645 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterDomicile: '\u0688\u0648\u0645\u06cc\u0633\u0627\u0626\u0644 \u0636\u0644\u0639 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterCnic: '\u0634\u0646\u0627\u062e\u062a\u06cc \u06a9\u0627\u0631\u0688 / \u0641\u0627\u0631\u0645-B \u0646\u0645\u0628\u0631 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterMobile: '\u0633\u0631\u06af\u0631\u0645 \u0645\u0648\u0628\u0627\u0626\u0644 \u0646\u0645\u0628\u0631 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterEmail: '\u0627\u067e\u0646\u0627 \u0627\u06cc \u0645\u06cc\u0644 \u0627\u06cc\u0688\u0631\u06cc\u0633 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterAddress: '\u0645\u06a9\u0645\u0644 \u0631\u06c1\u0627\u0626\u0634\u06cc \u067e\u062a\u06c1 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterBoardName: '\u0628\u0648\u0631\u0688 \u06a9\u0627 \u0646\u0627\u0645 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterRollNo: '\u0645\u06cc\u0679\u0631\u06a9 \u0631\u0648\u0644 \u0646\u0645\u0628\u0631 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterPassYear: '\u067e\u0627\u0633\u0646\u06af \u0633\u0627\u0644 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterObtainedMarks: '\u062d\u0627\u0635\u0644 \u06a9\u0631\u062f\u06c1 \u0646\u0645\u0628\u0631 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
    enterTotalMarks: '\u06a9\u0644 \u0646\u0645\u0628\u0631 \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('casdct_lang') || 'en';
  });

  const triggerGoogleTranslate = (langCode) => {
    const target = langCode;
    const cookieVal = `/en/${target}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;
    
    const runTranslate = () => {
      const selectEl = document.querySelector('.goog-te-combo');
      if (selectEl) {
        selectEl.value = target;
        selectEl.dispatchEvent(new Event('change'));
      }
    };
    runTranslate();
    setTimeout(runTranslate, 300);
    setTimeout(runTranslate, 800);
    setTimeout(runTranslate, 1500);
    setTimeout(runTranslate, 3000);
  };

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('casdct_lang', lang);
    triggerGoogleTranslate(lang);
  };

  useEffect(() => {
    const isRtl = language === 'ur';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    triggerGoogleTranslate(language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl: language === 'ur' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
