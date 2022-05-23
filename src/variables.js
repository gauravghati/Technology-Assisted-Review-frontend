const BASE_URL_BACKEND = "http://localhost:8000/";
const BASE_URL_FRONTEND = "http://localhost:3000/";

const TYPES = {
    PDF: "PDF",
    TEXT: "Text",
    PIC: "Picture",
};

const LABELS = {
    NULL: "null",
    LABEL0: "Label 0",
    LABEL1: "Label 1",
    LABEL2: "Label 2",
    LABEL3: "Label 3",
};

const SORT_BY = {
    NAME: "Name",
    UNCERTAINITY_SCORE: "Uncertainity Score",
    DOCUMENT_SIZE: "Document Size"
};

const STATUS = {
    MANUALLY_REVIEWED: "Manually Reviewed",
    AUTO_REVIEWED: "Auto Reviewed",
}

export { BASE_URL_BACKEND, BASE_URL_FRONTEND, TYPES, SORT_BY, STATUS, LABELS };
