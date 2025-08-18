import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import { api } from "../lib/api";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Field = {
  id: string;
  type:
    | "text"
    | "email"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "file";
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, any>;
  options?: { label: string; value: string }[];
  order: number;
};
type Form = {
  _id: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  settings: {
    thankYouMessage?: string;
    submissionLimit?: number;
    redirectUrl?: string;
  };
  fields: Field[];
};

const fieldTypes: Field["type"][] = [
  "text",
  "email",
  "select",
  "checkbox",
  "radio",
  "textarea",
  "file",
];

const newField = (type: Field["type"]): Field => ({
  id: Math.random().toString(36).slice(2),
  type,
  label: type.toUpperCase(),
  name: `${type}_${Math.random().toString(36).slice(2)}`,
  placeholder: "",
  required: false,
  validation: {},
  options:
    type === "select" || type === "checkbox" || type === "radio"
      ? [{ label: "Option 1", value: "opt1" }]
      : [],
  order: 0,
});

function SortableItem({
  field,
  onRemove,
  onChange,
}: {
  field: Field;
  onRemove: () => void;
  onChange: (f: Field) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">
          {field.label}{" "}
          <span className="text-xs text-gray-500">({field.type})</span>
        </div>
        <Button variant="outline" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="label">Label</label>
          <Input
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Name</label>
          <Input
            value={field.name}
            onChange={(e) => onChange({ ...field, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Placeholder</label>
          <Input
            value={field.placeholder || ""}
            onChange={(e) =>
              onChange({ ...field, placeholder: e.target.value })
            }
          />
        </div>
        <div>
          <label className="label">Required</label>
          <Select
            value={String(field.required)}
            onChange={(e) =>
              onChange({ ...field, required: e.target.value === "true" })
            }
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </Select>
        </div>
      </div>
      {(field.type === "select" ||
        field.type === "checkbox" ||
        field.type === "radio") && (
        <div className="mt-3">
          <label className="label">Options</label>
          <div className="space-y-2">
            {(field.options || []).map((opt, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={opt.label}
                  onChange={(e) => {
                    const next = [...(field.options || [])];
                    next[idx] = { ...next[idx], label: e.target.value };
                    onChange({ ...field, options: next });
                  }}
                  placeholder="Label"
                />
                <Input
                  value={opt.value}
                  onChange={(e) => {
                    const next = [...(field.options || [])];
                    next[idx] = { ...next[idx], value: e.target.value };
                    onChange({ ...field, options: next });
                  }}
                  placeholder="Value"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const next = [...(field.options || [])];
                    next.splice(idx, 1);
                    onChange({ ...field, options: next });
                  }}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                onChange({
                  ...field,
                  options: [
                    ...(field.options || []),
                    { label: "New", value: "new" },
                  ],
                })
              }
            >
              Add Option
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Builder() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState<Form | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    (async () => setForm(await api(`/api/forms/${id}`)))();
  }, [id]);

  const addField = (type: Field["type"]) => {
    if (!form) return;
    const next = [
      ...form.fields,
      { ...newField(type), order: form.fields.length },
    ];
    setForm({ ...form, fields: next });
  };

  const onDragEnd = (ev: DragEndEvent) => {
    if (!form) return;
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    const oldIndex = form.fields.findIndex((f) => f.id === active.id);
    const newIndex = form.fields.findIndex((f) => f.id === over.id);
    const next = arrayMove(form.fields, oldIndex, newIndex).map((f, i) => ({
      ...f,
      order: i,
    }));
    setForm({ ...form, fields: next });
  };

  const save = async () => {
    if (!form) return;
    await api(`/api/forms/${form._id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
    nav("/dashboard");
  };

  const deleteForm = async () => {
    if (!form) return;
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    await api(`/api/forms/${form._id}`, { method: "DELETE" });
    nav("/dashboard");
  };

  if (!form) return <div className="container py-6">Loading…</div>;

  return (
    <div className="container py-6 grid grid-cols-12 gap-4">
      {/* Sidebar */}
      <div className="col-span-3">
        <div className="card space-y-2">
          <div className="font-semibold">Add Field</div>
          {fieldTypes.map((t) => (
            <Button key={t} variant="outline" onClick={() => addField(t)}>
              {t}
            </Button>
          ))}
        </div>
        <div className="card mt-4 space-y-2">
          <div className="font-semibold">Settings</div>
          <label className="label">Title</label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <label className="label">Description</label>
          <Input
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="label">Status</label>
          <Select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as any })
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
          <label className="label">Thank You Message</label>
          <Input
            value={form.settings?.thankYouMessage || ""}
            onChange={(e) =>
              setForm({
                ...form,
                settings: { ...form.settings, thankYouMessage: e.target.value },
              })
            }
          />
          <label className="label">Submission Limit</label>
          <Input
            type="number"
            value={form.settings?.submissionLimit || 0}
            onChange={(e) =>
              setForm({
                ...form,
                settings: {
                  ...form.settings,
                  submissionLimit: Number(e.target.value),
                },
              })
            }
          />
          <label className="label">Redirect URL</label>
          <Input
            value={form.settings?.redirectUrl || ""}
            onChange={(e) =>
              setForm({
                ...form,
                settings: { ...form.settings, redirectUrl: e.target.value },
              })
            }
          />
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={deleteForm}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Main Builder */}
      <div className="col-span-9">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">Fields</div>
            <a
              className="btn"
              href={`/f/${form._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview
            </a>
          </div>
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <SortableContext
              items={form.fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {form.fields.map((field, idx) => (
                  <div key={field.id}>
                    <SortableItem
                      field={field}
                      onRemove={() =>
                        setForm({
                          ...form,
                          fields: form.fields.filter((f) => f.id !== field.id),
                        })
                      }
                      onChange={(f) => {
                        const next = [...form.fields];
                        next[idx] = f;
                        setForm({ ...form, fields: next });
                      }}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
