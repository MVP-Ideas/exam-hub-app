import { Question, QuestionType } from "./types"; // Adjust import as needed

export const questionsList: Question[] = [
  {
    order: 1,
    question:
      "Which Azure service is used for hosting and managing serverless functions?",
    choices: [
      {
        order: 1,
        choice: "Azure Functions",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 2,
        choice: "Azure Virtual Machines",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 3,
        choice: "Azure Kubernetes Service",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 4,
        choice: "Azure Logic Apps",
        isCorrect: false,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleChoice,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 2,
    question:
      "Which of the following are valid authentication methods for securing an Azure App Service?",
    choices: [
      {
        order: 1,
        choice: "Azure Active Directory (AAD)",
        isCorrect: true,
        isSelected: false,
      },
      { order: 2, choice: "OAuth 2.0", isCorrect: true, isSelected: false },
      {
        order: 3,
        choice: "HTTP Basic Authentication",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 4,
        choice: "JWT Bearer Tokens",
        isCorrect: true,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleAnswer,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 3,
    question:
      "Which .NET feature allows automatic dependency injection in an ASP.NET Core application?",
    choices: [
      {
        order: 1,
        choice: "IServiceCollection",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 2,
        choice: "IHttpContextAccessor",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 3,
        choice: "IWebHostBuilder",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 4,
        choice: "IApplicationBuilder",
        isCorrect: false,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleChoice,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 4,
    question:
      "Which storage options are available in Azure for hosting a NoSQL database?",
    choices: [
      {
        order: 1,
        choice: "Azure SQL Database",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 2,
        choice: "Azure Cosmos DB",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 3,
        choice: "Azure Table Storage",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 4,
        choice: "Azure Blob Storage",
        isCorrect: false,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleAnswer,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 5,
    question:
      "Which Azure service provides a fully managed Kubernetes environment?",
    choices: [
      {
        order: 1,
        choice: "Azure Kubernetes Service (AKS)",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 2,
        choice: "Azure Container Instances (ACI)",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 3,
        choice: "Azure App Service",
        isCorrect: false,
        isSelected: false,
      },
      { order: 4, choice: "Azure Batch", isCorrect: false, isSelected: false },
    ],
    type: QuestionType.MultipleChoice,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 6,
    question:
      "Which of the following Azure services support event-driven architectures?",
    choices: [
      {
        order: 1,
        choice: "Azure Event Grid",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 2,
        choice: "Azure Service Bus",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 3,
        choice: "Azure Key Vault",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 4,
        choice: "Azure Functions",
        isCorrect: true,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleAnswer,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 7,
    question: "What is the primary benefit of using Azure DevOps?",
    choices: [
      {
        order: 1,
        choice: "Managing infrastructure through code",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 2,
        choice: "Automating CI/CD pipelines",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 3,
        choice: "Managing virtual machines",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 4,
        choice: "Providing cloud storage",
        isCorrect: false,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleChoice,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 8,
    question:
      "Which of the following are valid lifecycle methods for an ASP.NET Core middleware?",
    choices: [
      {
        order: 1,
        choice: "ConfigureServices",
        isCorrect: false,
        isSelected: false,
      },
      { order: 2, choice: "Configure", isCorrect: true, isSelected: false },
      { order: 3, choice: "Invoke", isCorrect: true, isSelected: false },
      {
        order: 4,
        choice: "UseMiddleware",
        isCorrect: false,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleAnswer,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 9,
    question: "What is the primary purpose of Azure Key Vault?",
    choices: [
      {
        order: 1,
        choice: "To store and manage sensitive information securely",
        isCorrect: true,
        isSelected: false,
      },
      {
        order: 2,
        choice: "To deploy and manage containers",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 3,
        choice: "To monitor application performance",
        isCorrect: false,
        isSelected: false,
      },
      {
        order: 4,
        choice: "To provide cloud-based IDEs",
        isCorrect: false,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleChoice,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
  {
    order: 10,
    question:
      "Which authentication protocols are supported by Azure Active Directory?",
    choices: [
      { order: 1, choice: "OAuth 2.0", isCorrect: true, isSelected: false },
      { order: 2, choice: "SAML", isCorrect: true, isSelected: false },
      { order: 3, choice: "FTP", isCorrect: false, isSelected: false },
      {
        order: 4,
        choice: "OpenID Connect",
        isCorrect: true,
        isSelected: false,
      },
    ],
    type: QuestionType.MultipleAnswer,
    isAnswered: false,
    reviewLater: false,
    leaveFeedback: false,
  },
];
