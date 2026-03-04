import { useState, useEffect } from 'react';
import { Save, Loader2, FileEdit, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllContent, useUpdateContent } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentSection {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  multiline: boolean;
}

const SECTIONS: ContentSection[] = [
  {
    key: 'hero',
    label: 'Hero Section',
    description: 'Main headline text displayed in the hero banner on the homepage.',
    placeholder: 'e.g. Your Health is Our Top Priority',
    multiline: false,
  },
  {
    key: 'about',
    label: 'About Section',
    description: 'Text displayed in the About Us section describing the hospital.',
    placeholder: 'Write about SAMPARC MEDICAL, its history, mission, and values...',
    multiline: true,
  },
  {
    key: 'services',
    label: 'Services Description',
    description: 'Introductory text for the Services section on the homepage.',
    placeholder: 'Describe the range of services offered at SAMPARC MEDICAL...',
    multiline: true,
  },
  {
    key: 'announcements',
    label: 'Announcements',
    description: 'Important notices or announcements displayed to patients on the website.',
    placeholder: 'e.g. New OPD timings, special health camps, holiday notices...',
    multiline: true,
  },
];

export default function ContentEditor() {
  const { data: allContent, isLoading } = useGetAllContent();
  const updateContent = useUpdateContent();

  const [values, setValues] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (allContent) {
      const map: Record<string, string> = {};
      allContent.forEach(([key, val]) => { map[key] = val; });
      setValues(map);
    }
  }, [allContent]);

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setSavedKeys(prev => { const next = new Set(prev); next.delete(key); return next; });
  };

  const handleSave = async (key: string) => {
    const content = values[key] ?? '';
    try {
      await updateContent.mutateAsync({ section: key, content });
      toast.success(`"${SECTIONS.find(s => s.key === key)?.label}" saved successfully!`);
      setSavedKeys(prev => new Set(prev).add(key));
    } catch {
      toast.error('Failed to save content. Please try again.');
    }
  };

  const handleSaveAll = async () => {
    let successCount = 0;
    for (const section of SECTIONS) {
      const content = values[section.key] ?? '';
      try {
        await updateContent.mutateAsync({ section: section.key, content });
        successCount++;
      } catch {
        toast.error(`Failed to save "${section.label}".`);
      }
    }
    if (successCount > 0) {
      toast.success(`${successCount} section${successCount > 1 ? 's' : ''} saved successfully!`);
      setSavedKeys(new Set(SECTIONS.map(s => s.key)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Content Editor</h2>
          <p className="text-gray-500 text-sm">Edit the text content displayed on the public website. Changes are saved to the blockchain.</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={updateContent.isPending}
          className="inline-flex items-center gap-2 bg-medical-primary hover:bg-medical-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {updateContent.isPending ? (
            <><Loader2 size={15} className="animate-spin" /> Saving All...</>
          ) : (
            <><Save size={15} /> Save All Sections</>
          )}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-sm text-blue-700">
        <RefreshCw size={16} className="mt-0.5 shrink-0 text-blue-500" />
        <p>
          Content is stored on the Internet Computer blockchain. After saving, changes will be visible on the public website immediately when visitors reload the page.
        </p>
      </div>

      {/* Content Sections */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {SECTIONS.map(section => {
            const isSaved = savedKeys.has(section.key);
            const isSavingThis = updateContent.isPending && updateContent.variables?.section === section.key;

            return (
              <div key={section.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-medical-light rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <FileEdit size={15} className="text-medical-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{section.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                    </div>
                  </div>
                  {isSaved && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
                      <CheckCircle size={13} /> Saved
                    </span>
                  )}
                </div>
                <div className="p-6">
                  {section.multiline ? (
                    <textarea
                      value={values[section.key] ?? ''}
                      onChange={e => handleChange(section.key, e.target.value)}
                      placeholder={section.placeholder}
                      rows={5}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30 resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[section.key] ?? ''}
                      onChange={e => handleChange(section.key, e.target.value)}
                      placeholder={section.placeholder}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary/30"
                    />
                  )}
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleSave(section.key)}
                      disabled={isSavingThis}
                      className="inline-flex items-center gap-1.5 bg-medical-primary/10 hover:bg-medical-primary text-medical-primary hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSavingThis ? (
                        <><Loader2 size={13} className="animate-spin" /> Saving...</>
                      ) : (
                        <><Save size={13} /> Save Section</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
