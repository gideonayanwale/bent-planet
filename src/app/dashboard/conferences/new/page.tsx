"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { saveConferenceAction } from "./actions";

export default function NewConferencePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    theme: "",
    speaker: "",
    date: "",
    startTime: "",
    caption: "",
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-conference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setGeneratedData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => formDataObj.append(key, value));
      formDataObj.append("generatedData", JSON.stringify(generatedData));
      
      const fileInput = document.querySelector<HTMLInputElement>("#bannerImage");
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formDataObj.append("banner", fileInput.files[0]);
      }

      const result = await saveConferenceAction(formDataObj);
      if (result.error) throw new Error(result.error);
      
      router.push("/dashboard/conferences");
    } catch (error) {
      console.error(error);
      alert("Failed to save conference.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary mb-8">Create New Conference</h1>
      
      {!generatedData ? (
        <Card className="border-slate-200/70 shadow-sm">
          <CardHeader>
            <CardTitle>Conference Details</CardTitle>
            <CardDescription>Fill in the basics, and let AI generate a premium landing page.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Conference Name</Label>
                  <Input 
                    id="name" 
                    required 
                    placeholder="e.g. Open Heavens 2025" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Input 
                    id="theme" 
                    required 
                    placeholder="e.g. Revival & Healing" 
                    value={formData.theme}
                    onChange={e => setFormData({...formData, theme: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speaker">Speaker(s)</Label>
                  <Input 
                    id="speaker" 
                    required 
                    placeholder="e.g. Pastor John Doe" 
                    value={formData.speaker}
                    onChange={e => setFormData({...formData, speaker: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      required 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                      id="startTime" 
                      type="time" 
                      required 
                      value={formData.startTime}
                      onChange={e => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Short Description (Context for AI)</Label>
                <Textarea 
                  id="caption" 
                  required 
                  rows={3} 
                  placeholder="Tell us a little bit about the goal of this conference..."
                  value={formData.caption}
                  onChange={e => setFormData({...formData, caption: e.target.value})}
                />
              </div>
              
              <Button type="submit" size="lg" className="w-full" disabled={isGenerating}>
                {isGenerating ? "Generating Magic... ✨" : "Generate Conference Assets"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-green-800">Assets Generated Successfully! 🎉</CardTitle>
              <CardDescription className="text-green-700">Review your generated content before publishing.</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{generatedData.fullDescription}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Agenda & Speaker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Speaker Bio</h3>
                <p className="text-sm text-slate-700 mt-1">{generatedData.speakerBio}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Agenda</h3>
                <ul className="space-y-2">
                  {generatedData.agenda.map((item: any, i: number) => (
                    <li key={i} className="text-sm">
                      <span className="font-bold">{item.time}</span> - {item.title}
                      <p className="text-slate-500">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Final Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bannerImage">Upload Conference Banner</Label>
                <Input id="bannerImage" type="file" accept="image/*" required />
              </div>
              <Button size="lg" className="w-full" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Publishing..." : "Publish Conference"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
