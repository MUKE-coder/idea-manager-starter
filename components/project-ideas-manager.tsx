"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CategoryForm } from "@/components/category-form";
import { IdeaForm } from "@/components/idea-form";

// Mock data types
interface Category {
  id: string;
  title: string;
  slug: string;
  ideaCount: number;
}

interface Idea {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  createdAt: string;
}

// Mock data
const mockCategories: Category[] = [
  { id: "1", title: "Web Development", slug: "web-development", ideaCount: 12 },
  { id: "2", title: "Mobile Apps", slug: "mobile-apps", ideaCount: 8 },
  { id: "3", title: "AI & Machine Learning", slug: "ai-ml", ideaCount: 15 },
  { id: "4", title: "E-commerce", slug: "ecommerce", ideaCount: 6 },
  { id: "5", title: "SaaS Products", slug: "saas-products", ideaCount: 10 },
  { id: "6", title: "Gaming", slug: "gaming", ideaCount: 4 },
  {
    id: "7",
    title: "Productivity Tools",
    slug: "productivity-tools",
    ideaCount: 7,
  },
];

const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "Task Management Dashboard",
    slug: "task-management-dashboard",
    description: `<h3>Overview</h3>
    <p>A comprehensive task management system with <strong>real-time collaboration</strong> features.</p>
    
    <h4>Key Features:</h4>
    <ul>
      <li>Drag-and-drop task organization</li>
      <li>Team collaboration with comments</li>
      <li>Time tracking and reporting</li>
      <li>Integration with popular tools like Slack and GitHub</li>
    </ul>
    
    <p>Check out similar projects: <a href="https://trello.com" target="_blank">Trello</a> and <a href="https://asana.com" target="_blank">Asana</a></p>`,
    categoryId: "1",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "E-learning Platform",
    slug: "elearning-platform",
    description: `<h3>Concept</h3>
    <p>An interactive e-learning platform focused on <em>practical skills development</em>.</p>
    
    <h4>Core Components:</h4>
    <ul>
      <li>Video-based lessons with interactive quizzes</li>
      <li>Progress tracking and certificates</li>
      <li>Community forums for peer learning</li>
      <li>Mobile-responsive design</li>
    </ul>
    
    <blockquote>
      <p>"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela</p>
    </blockquote>`,
    categoryId: "1",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Fitness Tracking App",
    slug: "fitness-tracking-app",
    description: `<h3>App Overview</h3>
    <p>A comprehensive fitness tracking application with <strong>AI-powered recommendations</strong>.</p>
    
    <h4>Features:</h4>
    <ul>
      <li>Workout planning and tracking</li>
      <li>Nutrition logging with barcode scanning</li>
      <li>Social challenges and leaderboards</li>
      <li>Wearable device integration</li>
    </ul>`,
    categoryId: "2",
    createdAt: "2024-01-25",
  },
  {
    id: "4",
    title: "Smart Home Controller",
    slug: "smart-home-controller",
    description: `<h3>Project Description</h3>
    <p>A unified smart home control system using <strong>IoT integration</strong>.</p>
    
    <h4>Capabilities:</h4>
    <ul>
      <li>Voice control integration</li>
      <li>Energy usage monitoring</li>
      <li>Security system management</li>
      <li>Automated scheduling</li>
    </ul>`,
    categoryId: "2",
    createdAt: "2024-02-01",
  },
  {
    id: "5",
    title: "AI Content Generator",
    slug: "ai-content-generator",
    description: `<h3>AI-Powered Solution</h3>
    <p>An advanced content generation tool using <strong>large language models</strong>.</p>
    
    <h4>Use Cases:</h4>
    <ul>
      <li>Blog post generation</li>
      <li>Social media content creation</li>
      <li>Email marketing campaigns</li>
      <li>SEO-optimized content</li>
    </ul>
    
    <p>Technologies: <code>OpenAI GPT</code>, <code>Anthropic Claude</code>, <code>Hugging Face</code></p>`,
    categoryId: "3",
    createdAt: "2024-02-05",
  },
];

const ITEMS_PER_PAGE = 5;

export function ProjectIdeasManager() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [ideaSearch, setIdeaSearch] = useState("");
  const [categoryPage, setCategoryPage] = useState(1);
  const [ideaPage, setIdeaPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showIdeaForm, setShowIdeaForm] = useState(false);

  // Filter and paginate categories
  const filteredCategories = useMemo(() => {
    return mockCategories.filter(
      (category) =>
        category.title.toLowerCase().includes(categorySearch.toLowerCase()) ||
        category.slug.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

  const paginatedCategories = useMemo(() => {
    const start = (categoryPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, categoryPage]);

  const categoryTotalPages = Math.ceil(
    filteredCategories.length / ITEMS_PER_PAGE
  );

  // Filter and paginate ideas
  const filteredIdeas = useMemo(() => {
    let ideas = mockIdeas;
    if (selectedCategory) {
      ideas = ideas.filter((idea) => idea.categoryId === selectedCategory);
    }
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(ideaSearch.toLowerCase()) ||
        idea.slug.toLowerCase().includes(ideaSearch.toLowerCase())
    );
  }, [selectedCategory, ideaSearch]);

  const paginatedIdeas = useMemo(() => {
    const start = (ideaPage - 1) * ITEMS_PER_PAGE;
    return filteredIdeas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIdeas, ideaPage]);

  const ideaTotalPages = Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE);

  const selectedIdeaData = mockIdeas.find((idea) => idea.id === selectedIdea);
  const selectedCategoryData = mockCategories.find(
    (cat) => cat.id === selectedCategory
  );

  const handleCategorySubmit = (data: { title: string; slug: string }) => {
    console.log("[v0] Category submitted:", data);
    // Here you would typically save to database
  };

  const handleIdeaSubmit = (data: {
    title: string;
    slug: string;
    description: string;
    categoryId: string;
  }) => {
    console.log("[v0] Idea submitted:", data);
    // Here you would typically save to database
  };

  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80",
  };

  const handleLogout = () => {
    console.log("[v0] User logged out");
    // Handle logout logic here
  };

  return (
    <div className="flex h-screen bg-background pt-16">
      <div
        className={`${
          sidebarCollapsed ? "w-12" : "w-80"
        } border-r border-border flex flex-col bg-background transition-all duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-semibold text-foreground">
                Categories
              </h2>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {!sidebarCollapsed && (
            <>
              <div className="flex items-center gap-2 mt-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setCategoryPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                {/* <Button size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button> */}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2 bg-transparent"
                onClick={() => setShowCategoryForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </>
          )}
        </div>

        {/* Categories List */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-2">
            {paginatedCategories.map((category) => (
              <Collapsible key={category.id}>
                <CollapsibleTrigger asChild>
                  <div
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedIdea(null);
                      setIdeaPage(1);
                    }}
                    className={`mb-2 p-0 shadow-sm cursor-pointer transition-all py-3 px-4 flex items-center justify-between rounded-sm ${
                      selectedCategory === category.id
                        ? "ring ring-primary"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-foreground">
                        {category.title}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.ideaCount}
                    </Badge>
                  </div>
                </CollapsibleTrigger>
              </Collapsible>
            ))}
          </div>
        )}

        {/* Category Pagination */}
        {!sidebarCollapsed && categoryTotalPages > 1 && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryPage(Math.max(1, categoryPage - 1))}
                disabled={categoryPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {categoryPage} of {categoryTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCategoryPage(
                    Math.min(categoryTotalPages, categoryPage + 1)
                  )
                }
                disabled={categoryPage === categoryTotalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ideas Column */}
      <div className="w-80 border-r border-border flex flex-col bg-background">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedCategoryData ? selectedCategoryData.title : "All Ideas"}
            </h2>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setShowIdeaForm(true)}
              disabled={!selectedCategory}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                value={ideaSearch}
                onChange={(e) => {
                  setIdeaSearch(e.target.value);
                  setIdeaPage(1);
                }}
                className="pl-9"
              />
            </div>
            {/* <Button size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {paginatedIdeas.map((idea) => (
            <Card
              key={idea.id}
              className={`mb-2 p-2 cursor-pointer transition-all hover:shadow-sm ${
                selectedIdea === idea.id ? "ring ring-muted-foreground" : ""
              }`}
              onClick={() => setSelectedIdea(idea.id)}
            >
              <CardContent className="p-3">
                <h3 className="font-medium text-sm text-foreground mb-1">
                  {idea.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(idea.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ideas Pagination */}
        {ideaTotalPages > 1 && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIdeaPage(Math.max(1, ideaPage - 1))}
                disabled={ideaPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {ideaPage} of {ideaTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setIdeaPage(Math.min(ideaTotalPages, ideaPage + 1))
                }
                disabled={ideaPage === ideaTotalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Column */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedIdeaData ? (
          <>
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {selectedIdeaData.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Created:{" "}
                  {new Date(selectedIdeaData.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div
                className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{
                  __html: selectedIdeaData.description,
                }}
                style={
                  {
                    "--tw-prose-body": "var(--foreground)",
                    "--tw-prose-headings": "var(--foreground)",
                    "--tw-prose-links": "var(--primary)",
                    "--tw-prose-bold": "var(--foreground)",
                    "--tw-prose-code": "var(--primary)",
                    "--tw-prose-quotes": "var(--muted-foreground)",
                  } as React.CSSProperties
                }
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Select an idea to view details
              </h3>
              <p className="text-muted-foreground">
                Choose a category and then select an idea to see its full
                description
              </p>
            </div>
          </div>
        )}
      </div>

      <CategoryForm
        open={showCategoryForm}
        onOpenChange={setShowCategoryForm}
        onSubmit={handleCategorySubmit}
      />

      <IdeaForm
        open={showIdeaForm}
        onOpenChange={setShowIdeaForm}
        onSubmit={handleIdeaSubmit}
        categoryId={selectedCategory || ""}
      />
    </div>
  );
}
