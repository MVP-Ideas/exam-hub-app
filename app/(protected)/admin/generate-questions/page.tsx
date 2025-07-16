"use client";

import { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FileTextIcon,
  LinkIcon,
  Loader2,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionSourceType, QuestionType } from "@/lib/types/questions";
import useGenerateQuestions from "@/hooks/questions/useGenerateQuestions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import useCreateQuestion from "@/hooks/questions/useCreateQuestion";
import { getQuestionTypeBadge } from "@/lib/constants/question";
import { GeneratedQuestionResponse } from "@/lib/types/functions-ai";
import { CreateQuestionRequest } from "@/lib/types/questions";

export default function Page() {
  const [textContent, setTextContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const [questionType, setQuestionType] = useState("multiple-choice-single");
  const [questionCount, setQuestionCount] = useState(5);

  const [questions, setQuestions] = useState<
    {
      question: GeneratedQuestionResponse;
      isSaved: boolean;
      isPending: boolean;
    }[]
  >([]);
  const [questionsHistory, setQuestionsHistory] = useState<
    {
      question: GeneratedQuestionResponse;
      isSaved: boolean;
      isPending: boolean;
    }[]
  >([]);

  const { generateQuestions, isPending } = useGenerateQuestions();
  const { createQuestion } = useCreateQuestion();

  const handleGenerateQuestions = async () => {
    try {
      const questionTypeMap = {
        "multiple-choice-single": QuestionType.MultipleChoiceSingle,
        "multiple-choice-multiple": QuestionType.MultipleChoiceMultiple,
        "true-false": QuestionType.TrueFalse,
        "drag-and-drop": QuestionType.DragAndDrop,
      };

      const generatedQuestions = await generateQuestions({
        sourceType: QuestionSourceType.Text,
        content: textContent,
        questionCount: questionCount,
        allowedQuestionType:
          questionTypeMap[questionType as keyof typeof questionTypeMap],
      });

      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestionsHistory((prevQuestions) => [
          ...generatedQuestions.map((question) => ({
            question: question,
            isSaved: false,
            isPending: false,
          })),
          ...prevQuestions,
        ]);
        setQuestions(() =>
          generatedQuestions.map((question) => ({
            question: question,
            isSaved: false,
            isPending: false,
          })),
        );

        toast.success("Questions generated successfully");
      } else {
        toast.error("Failed to generate questions");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveQuestion = async (question: GeneratedQuestionResponse) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.question.text === question.text ? { ...q, isPending: true } : q,
      ),
    );
    setQuestionsHistory((prevQuestions) =>
      prevQuestions.map((q) =>
        q.question.text === question.text ? { ...q, isPending: true } : q,
      ),
    );

    const questionData: CreateQuestionRequest = {
      text: question.text,
      type: question.type,
      choices: question.choices,
      resources: [],
      categoryIds: [],
      description: "",
      aiHelpEnabled: false,
    };

    try {
      await createQuestion(questionData);
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.question.text === question.text ? { ...q, isSaved: true } : q,
        ),
      );
      setQuestionsHistory((prevQuestions) =>
        prevQuestions.map((q) =>
          q.question.text === question.text ? { ...q, isSaved: true } : q,
        ),
      );
      toast.success("Question saved successfully");

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.question.text === question.text ? { ...q, isPending: false } : q,
        ),
      );
      setQuestionsHistory((prevQuestions) =>
        prevQuestions.map((q) =>
          q.question.text === question.text ? { ...q, isPending: false } : q,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to save question");
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        alert("Please select a PDF or DOCX file only.");
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/msword": [".doc"],
      },
      maxFiles: 1,
      maxSize: 50 * 1024 * 1024, // 50MB
    });

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center p-10">
      <div className="flex h-full w-full flex-col gap-6">
        {/* Header */}
        <div className="flex w-full flex-row flex-wrap items-end justify-between gap-y-4">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold">Generate Questions</h1>
            <p className="text-sm">
              Generate questions from your content using AI. Upload files, paste
              text, or provide links to create customized questions
            </p>
          </div>
        </div>

        {/* Content Source */}
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-lg font-bold">Content Source</h2>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Link
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <UploadIcon className="h-4 w-4" />
                File Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="context-text">Context Text</Label>
                <Textarea
                  id="context-text"
                  placeholder="Paste your content here... (e.g., lecture notes, textbook content, study materials)"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-40"
                />
                <p className="text-muted-foreground text-sm">
                  Paste any text content you want to generate questions from
                </p>
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-link">Content URL</Label>
                <Input
                  id="content-link"
                  type="url"
                  placeholder="https://example.com/article"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <p className="text-muted-foreground text-sm">
                  Provide a link to an article, documentation, or web page
                </p>
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Document</Label>
                {!selectedFile && (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                      isDragActive && "border-primary bg-primary/10",
                      isDragReject && "border-destructive bg-destructive/10",
                      !isDragActive &&
                        !isDragReject &&
                        "border-muted-foreground/25 hover:border-muted-foreground/50",
                    )}
                  >
                    <Input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-muted rounded-full p-4">
                        <UploadIcon className="text-muted-foreground h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {isDragActive
                            ? "Drop the file here"
                            : "Drag & drop a file here"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          or click to select a file
                        </p>
                        <p className="text-muted-foreground text-xs">
                          PDF or DOCX files only (max 50MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFile && (
                  <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {selectedFile.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Question Configuration */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Question Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Question Type</Label>
              <RadioGroup
                value={questionType}
                onValueChange={setQuestionType}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="multiple-choice-single"
                    id="multiple-choice-single"
                  />
                  <Label
                    htmlFor="multiple-choice-single"
                    className="text-sm font-normal"
                  >
                    Multiple Choice Single
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="multiple-choice-multiple"
                    id="multiple-choice-multiple"
                  />
                  <Label
                    htmlFor="multiple-choice-multiple"
                    className="text-sm font-normal"
                  >
                    Multiple Choice Multiple
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true-false" id="true-false" />
                  <Label htmlFor="true-false" className="text-sm font-normal">
                    True/False
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="drag-and-drop" id="drag-and-drop" />
                  <Label
                    htmlFor="drag-and-drop"
                    className="text-sm font-normal"
                  >
                    Drag and Drop
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question Count */}
            <div className="flex flex-col justify-between">
              <Label htmlFor="question-count" className="text-sm font-medium">
                Number of Questions
              </Label>
              <div className="space-y-2">
                <Input
                  id="question-count"
                  type="number"
                  min="1"
                  max="15"
                  value={questionCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 15) {
                      setQuestionCount(value);
                    }
                  }}
                  className="w-24"
                  placeholder="5"
                />
              </div>
            </div>
            {/* Action Button */}
            <div className="flex items-end justify-end">
              <Button
                disabled={
                  (activeTab === "text" && !textContent.trim()) ||
                  (activeTab === "link" && !linkUrl.trim()) ||
                  (activeTab === "file" && !selectedFile) ||
                  isPending
                }
                onClick={handleGenerateQuestions}
              >
                Generate Questions
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Generated Questions */}
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-lg font-bold">Generated Questions</h2>

          <div className="flex flex-col gap-4">
            {questions.length === 0 ? (
              <div className="bg-muted/30 flex min-h-[200px] items-center justify-center rounded-lg p-8 text-center md:min-h-[400px]">
                <p className="text-muted-foreground">
                  No questions generated yet. Add content above and click
                  &quot;Generate Questions&quot; to get started.
                </p>
              </div>
            ) : (
              questions.map((question, index) => (
                <ReadonlyQuestionDisplay
                  key={"generated-" + index}
                  question={question.question}
                  index={index}
                  isSaved={question.isSaved}
                  isPending={question.isPending}
                  onSave={() => {
                    handleSaveQuestion(question.question);
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Questions History */}
        {(() => {
          // Filter out questions that are in the current set
          const currentQuestionTexts = new Set(
            questions.map((q) => q.question.text),
          );
          const historyQuestions = questionsHistory.filter(
            (historyQ) => !currentQuestionTexts.has(historyQ.question.text),
          );

          return (
            historyQuestions.length > 0 && (
              <>
                <Separator />
                <div className="flex w-full flex-col gap-4">
                  <h2 className="text-lg font-bold">
                    Generated Questions History
                  </h2>
                  <div className="flex flex-col gap-4">
                    {historyQuestions.map((question, index) => (
                      <ReadonlyQuestionDisplay
                        key={"history-" + index}
                        question={question.question}
                        index={index}
                        isSaved={question.isSaved}
                        isPending={question.isPending}
                        onSave={() => {
                          handleSaveQuestion(question.question);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )
          );
        })()}
      </div>
    </div>
  );
}

const ReadonlyQuestionDisplay = ({
  question,
  index,
  onSave,
  isSaved,
  isPending,
}: {
  question: GeneratedQuestionResponse;
  index: number;
  onSave: (question: GeneratedQuestionResponse) => void;
  isSaved: boolean;
  isPending: boolean;
}) => {
  const renderChoices = () => {
    switch (question.type) {
      case QuestionType.MultipleChoiceSingle:
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Answer Options</Label>
            <RadioGroup value="" className="space-y-2">
              {question.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={choiceIndex.toString()}
                    id={`q${index}-choice${choiceIndex}`}
                    checked={choice.isCorrect}
                    disabled
                  />
                  <Label
                    htmlFor={`q${index}-choice${choiceIndex}`}
                    className={`text-sm ${choice.isCorrect ? "font-medium text-green-700" : "font-normal"}`}
                  >
                    {choice.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case QuestionType.MultipleChoiceMultiple:
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selectable Options</Label>
            <div className="space-y-2">
              {question.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`q${index}-choice${choiceIndex}`}
                    checked={choice.isCorrect}
                  />
                  <Label
                    htmlFor={`q${index}-choice${choiceIndex}`}
                    className={`text-sm ${choice.isCorrect ? "font-medium text-green-700" : "font-normal"}`}
                  >
                    {choice.text}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case QuestionType.TrueFalse:
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Correct Answer</Label>
            <RadioGroup value="" className="flex flex-col space-x-6">
              {question.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={choice.text.toLowerCase()}
                    id={`q${index}-${choice.text.toLowerCase()}`}
                    checked={choice.isCorrect}
                    disabled
                  />
                  <Label
                    htmlFor={`q${index}-${choice.text.toLowerCase()}`}
                    className={`text-sm ${choice.isCorrect ? "font-medium text-green-700" : "font-normal"}`}
                  >
                    {choice.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case QuestionType.DragAndDrop:
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Draggable Items</Label>
            <div className="space-y-2 rounded-md border p-3">
              {question.choices.map((choice, choiceIndex) => (
                <div
                  key={choiceIndex}
                  className="bg-muted/30 flex items-center justify-between gap-2 rounded border p-2"
                >
                  <span className="text-sm">{choice.text}</span>
                  <Badge variant="outline" className="text-xs">
                    Item {choiceIndex + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-col items-start gap-x-2 md:flex-row">
              <p className="text-sm leading-relaxed">{question.text}</p>

              {getQuestionTypeBadge(question.type)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChoices()}

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => onSave(question)}
            disabled={isSaved || isPending}
            variant={isSaved ? "outline" : "default"}
          >
            {isSaved ? "Saved" : isPending ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
