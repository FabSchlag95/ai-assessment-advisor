import { models, types } from "@/data/models";
import { presets } from "@/data/presets";
import { useFormReducer } from "@/hooks/playgroundReducer";
import {
  Lightbulb,
  PlusIcon,
  SplitSquareHorizontalIcon,
  SquareChartGantt,
} from "lucide-react";
import Criterion from "@/components/Criterion";
import { CriticalnessSelector } from "@/components/criticalness-selector";
import { ModelSelector } from "@/components/model-selector";
import { PresetActions } from "@/components/preset-actions";
import { PresetSave } from "@/components/preset-save";
import { PresetSelector } from "@/components/preset-selector";
import { ToggleCoT } from "@/components/toggle-cot";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Hint from "@/components/Hint";
import api from "@/api/base";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type PlaygroundParams = {
  [key: string]: string;
};

export default function Playground() {
  const [ideaData, setIdeaData] = useState<PlaygroundParams>();
  const { state, dispatch } = useFormReducer(presets);
  const { slug } = useParams();
  const { state: rowIdeaData } = useLocation();
  const navigate = useNavigate();

  const savePreset = (name: string) => {
    dispatch({
      type: "ADD_PRESET",
      payload: { id: name, name, values: state.formValues },
    });
  };

  const fetchIdeaData = (slug: string) => {
    if (rowIdeaData) {
      setIdeaData(rowIdeaData);
      return;
    }
    api
      .get("get_idea", { params: { slug } })
      .then((res) => {
        setIdeaData(res.data);
      })
      .catch((err) => console.error(err));
  };

  const navigateToAssessment = () => {
    navigate(`/playground/${slug}/assessment`, {
      state: { ...state, ideaData },
    });
  };

  const removeCriterion = (idx: number) => {
    return () => dispatch({ type: "REMOVE_CRITERION", idx });
  };

  useEffect(() => {
    fetchIdeaData(slug ?? "");
  }, [slug]);

  if (ideaData)
    return (
      <div className="rounded-lg border p-4 max-w-[1200px] w-full">
        <div className="hidden h-full flex-col md:flex ">
          <div className="w-full flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
            <h2 className="text-lg font-semibold">Playground</h2>
            <div className="ml-auto flex w-full space-x-2 sm:justify-end">
              <PresetSelector
                setForm={(id: string) =>
                  dispatch({ type: "SELECT_PRESET", payload: id })
                }
                presets={state.presets}
              />
              <Button
                onClick={() =>
                  savePreset(state.selectedPresetId || "new-preset")
                }
                type="button"
              >
                Save
              </Button>
              <PresetSave onSave={savePreset} />
              <PresetActions
                deletePreset={() =>
                  dispatch({
                    type: "DELETE_PRESET",
                    payload: state.selectedPresetId || "",
                  })
                }
              />
            </div>
          </div>
          <Separator />
          <Tabs defaultValue="complete" className="flex-1">
            <div className="w-full h-full py-6">
              <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
                <div className="hidden h-fit sticky top-4 flex-col space-y-8 sm:flex border rounded-md p-4 md:order-2">
                  <div className="grid gap-2">
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger asChild>
                        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          View
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-[320px] text-sm"
                        side="left"
                      >
                        Choose the interface that best suits your task. You can
                        provide: a simple prompt to complete, starting and
                        ending text to insert a completion within, or some text
                        with instructions to edit it.
                      </HoverCardContent>
                    </HoverCard>
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="complete">
                        <span className="sr-only">Complete</span>
                        <SquareChartGantt />
                      </TabsTrigger>
                      <TabsTrigger value="insert">
                        <span className="sr-only">Insert</span>
                        <SplitSquareHorizontalIcon />
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <ModelSelector
                    {...{ state, dispatch }}
                    types={types}
                    models={models}
                  />
                  <CriticalnessSelector {...{ state, dispatch }} />
                  <ToggleCoT {...{ state, dispatch }} />
                  <Button
                    className="text-xs"
                    variant={"default"}
                    onClick={navigateToAssessment}
                  >
                    <span>Generate Assessment</span>
                    <Lightbulb />
                  </Button>
                </div>
                <div className="md:order-1 flex-1">
                  <TabsContent value="complete" className="mt-0 border-0 p-0">
                    <div className="flex h-full flex-col space-y-4">
                      <div className="min-h-[400px] flex flex-col flex-1 p-4 md:min-h-[700px] lg:min-h-[700px] gap-12">
                        {Object.entries(ideaData).map(
                          ([fieldKey, fieldValue]) => {
                            return (
                              <div className="">
                                {fieldKey == "title" ? (
                                  <h2 className="text-5xl font-black">
                                    {fieldValue}
                                  </h2>
                                ) : (
                                  <h3 className="text-3xl font-bold p-2">
                                    {fieldKey != "slug" ? fieldKey : ""}
                                  </h3>
                                )}
                                <Separator />
                                {!["title", "slug"].includes(fieldKey) && (
                                  <p className="whitespace-pre-wrap p-2">
                                    {Array.isArray(fieldValue)
                                      ? fieldValue.join("\n")
                                      : fieldValue}
                                  </p>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="insert" className="mt-0 border-0 p-0">
                    <div className="flex flex-col space-y-4">
                      <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                        <div className="rounded-md border p-2 gap-2 flex flex-col">
                          <h3 className="text-3xl font-bold p-2">
                            Personality and Role
                          </h3>
                          <Hint
                            title="Style and Tone"
                            name="styleAndTone"
                            {...{ dispatch, state }}
                            hoverText="Describe how you like the style and tone of the tool's arguments."
                          />
                          <Hint
                            title="Further Hints"
                            name="furtherHints"
                            {...{ dispatch, state }}
                            hoverText="Add any further hints if you like."
                          />
                        </div>
                        <div className="rounded-md border p-2 gap-2 flex flex-col">
                          <h3 className="text-3xl font-bold p-2">Criteria</h3>
                          {state.formValues.criteria.map(
                            ({ name, hint, scale }, i) => (
                              <Criterion
                                name={name}
                                scale={scale}
                                hint={hint}
                                dispatch={dispatch}
                                remove={removeCriterion(i)}
                              />
                            )
                          )}
                          <Button
                            variant={"outline"}
                            onClick={() => {
                              dispatch({
                                type: "ADD_CRITERION",
                                value: {
                                  name: "A Criterion",
                                  scale: "1\n2\n3\n4\n5",
                                  hint: "A hint.",
                                },
                              });
                            }}
                          >
                            <PlusIcon />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    );
}
