

type Argument = {
  text: string;
  evidence: number[];
};


type Evaluation = {
  rating: number;
  arguments: Argument[];
};

type Assessment = Record<string, Evaluation>;


type SegmentIdeaField = {
  field_name: string;
  segments: string[];
  first_index: number;
};

// Equivalent of: ToolOutput = TypedDict("ToolOutput", {"assessment": ModelOutput, "idea_fields": list[SegmentIdeaField]})
export type ToolOutput = {
  assessment: Assessment;
  idea_fields: SegmentIdeaField[];
};
