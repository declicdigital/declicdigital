import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronDown, ChevronUp, Download, Mail, Phone, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const INK = "#2B1E3F";
const INK_L = "rgba(43,30,63,0.50)";
const INK_XL = "rgba(43,30,63,0.30)";
const BG = "#F6F1E9";
const BG_CARD = "#EDE8DF";
const BG_INPUT = "rgba(43,30,63,0.05)";
const BORDER = "rgba(43,30,63,0.09)";

interface Submission {
  id: string; created_at: string; status: string; file_paths: string[];
  full_name: string; email: string; phone: string; company: string; sector: string; size: string;
  current_url: string; source: string; project_types: string[]; description: string; inspiration: string;
  keywords: string; goal: string; acquisition_sources: string[]; budget: string; recurrence: string;
  urgency: string; brand: string; content_available: string[]; pages_count: string; features: string[];
  features_other: string; vibe: string; team_enabled: boolean; team_data: any[]; deadline: string;
  key_date: string; autonomy: string; web_level: string; past_experience: string; past_issue: string;
  message: string; contact_pref: string; time_slot: string; file_types: string[]; file_link: string; file_notes: string;
}

const STATUS_OPTIONS = ["new","lu","en_cours","traite"];
const STATUS_LABELS: Record<string,{label:string;color:string}> = {
  new:{label:"Nouveau",color:"bg-amber-100 text-amber-700"},
  lu:{label:"Lu",color:"bg-blue-100 text-blue-700"},
  en_cours:{label:"En cours",color:"bg-purple-100 text-purple-700"},
  traite:{label:"Traité",color:"bg-green-100 text-green-700"},
};

const Field = ({label,value}:{label:string;value:string|string[]|boolean|undefined|null}) => {
  if(!value||(Array.isArray(value)&&value.length===0)||value===false) return null;
  const display = Array.isArray(value)?value.join(", "):value===true?"Oui":String(value);
  if(!display.trim()) return null;
  return (
    <div>
      <p className="text-xs mb-1" style={{color:INK_XL}}>{label}</p>
      <p className="text-sm leading-relaxed" style={{color:INK_L}}>{display}</p>
    </div>
  );
};

export default function AdminSoumissions() {
  const {isAdmin,loading} = useAdminAuth();
  const navigate = useNavigate();
  const [submissions,setSubmissions] = useState<Submission[]>([]);
  const [loadingData,setLoadingData] = useState(true);
  const [expanded,setExpanded] = useState<string|null>(null);
  const [filterStatus,setFilterStatus] = useState<string>("all");

  useEffect(()=>{ if(!loading&&!isAdmin) navigate("/admin/login"); },[loading,isAdmin,navigate]);
  useEffect(()=>{ if(!isAdmin) return; fetchSubmissions(); },[isAdmin]);

  async function fetchSubmissions() {
    const {data,error} = await supabase.from("brief_submissions").select("*").order("created_at",{ascending:false});
    if(error) console.error("Erreur fetch:",error);
    setSubmissions(data??[]); setLoadingData(false);
  }

  async function updateStatus(id:string,status:string) {
    await supabase.from("brief_submissions").update({status}).eq("id",id);
    setSubmissions(prev=>prev.map(s=>s.id===id?{...s,status}:s));
  }

  async function deleteSubmission(id:string) {
    if(!confirm("Supprimer cette soumission ? Cette action est irréversible.")) return;
    const {error} = await supabase.from("brief_submissions").delete().eq("id",id);
    if(!error){ setSubmissions(prev=>prev.filter(s=>s.id!==id)); if(expanded===id) setExpanded(null); }
    else alert("Erreur lors de la suppression");
  }

  async function downloadFile(path:string) {
    const {data,error} = await supabase.storage.from("form-files").download(path);
    if(error||!data){alert("Erreur téléchargement");return;}
    const url=URL.createObjectURL(data);
    const a=document.createElement("a"); a.href=url; a.download=path.split("/").pop()||"fichier"; a.click(); URL.revokeObjectURL(url);
  }

  const filtered = filterStatus==="all"?submissions:submissions.filter(s=>s.status===filterStatus);

  if(loading) return <div className="min-h-screen" style={{background:BG}} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{color:INK}}>Soumissions</h1>
            <p className="text-sm mt-1" style={{color:INK_XL}}>{submissions.length} demande{submissions.length>1?"s":""} reçue{submissions.length>1?"s":""}</p>
          </div>
          <button onClick={fetchSubmissions} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{background:BG_CARD,color:INK_L,border:`1px solid ${BORDER}`}}>
            Actualiser
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={()=>setFilterStatus("all")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={filterStatus==="all"?{background:INK,color:BG}:{background:BG_CARD,color:INK_L,border:`1px solid ${BORDER}`}}>
            Tous ({submissions.length})
          </button>
          {STATUS_OPTIONS.map(s=>{
            const count=submissions.filter(sub=>sub.status===s).length;
            return (
              <button key={s} onClick={()=>setFilterStatus(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={filterStatus===s?{background:INK,color:BG}:{background:BG_CARD,color:INK_L,border:`1px solid ${BORDER}`}}>
                {STATUS_LABELS[s]?.label??s} ({count})
              </button>
            );
          })}
        </div>

        {loadingData ? (
          <div className="space-y-3">
            {[1,2,3].map(i=><div key={i} className="rounded-2xl p-5 animate-pulse h-24" style={{background:BG_CARD}} />)}
          </div>
        ) : filtered.length===0 ? (
          <div className="text-center py-16">
            <FileText size={32} className="mx-auto mb-3" style={{color:INK_XL}} />
            <p style={{color:INK_XL}}>Aucune soumission</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(sub=>{
              const sl=STATUS_LABELS[sub.status]??{label:sub.status,color:"bg-gray-100 text-gray-600"};
              const isExpanded=expanded===sub.id;
              const name=sub.full_name||"—";
              return (
                <div key={sub.id} className="rounded-2xl overflow-hidden" style={{background:BG_CARD,border:`1px solid ${BORDER}`}}>
                  <div className="p-5 flex items-center justify-between cursor-pointer transition-colors"
                    style={{}} onClick={()=>setExpanded(isExpanded?null:sub.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{background:"rgba(43,30,63,0.10)",color:INK_L}}>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{color:INK}}>{name} {sub.company&&<span style={{color:INK_XL}}>— {sub.company}</span>}</p>
                        <p className="text-xs" style={{color:INK_XL}}>{sub.email} {sub.budget&&`· ${sub.budget}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs hidden sm:block" style={{color:INK_XL}}>
                        {new Date(sub.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sl.color}`}>{sl.label}</span>
                      {isExpanded?<ChevronUp size={14} style={{color:INK_XL}} />:<ChevronDown size={14} style={{color:INK_XL}} />}
                      <button onClick={e=>{e.stopPropagation();deleteSubmission(sub.id);}}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                        style={{color:"rgba(180,50,50,0.5)"}} title="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </div>

                  {isExpanded&&(
                    <div className="border-t p-5 space-y-6" style={{borderColor:BORDER}}>
                      <div className="flex flex-wrap gap-2">
                        <a href={`mailto:${sub.email}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                          style={{background:"rgba(59,130,246,0.08)",color:"rgb(37,99,235)"}}>
                          <Mail size={13} /> Répondre par email
                        </a>
                        {sub.phone&&(
                          <a href={`tel:${sub.phone}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                            style={{background:"rgba(34,197,94,0.08)",color:"rgb(22,163,74)"}}>
                            <Phone size={13} /> Appeler
                          </a>
                        )}
                        {sub.current_url&&(
                          <a href={sub.current_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                            style={{background:BG_INPUT,color:INK_L}}>
                            <ExternalLink size={13} /> Voir le site actuel
                          </a>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>👤 Profil</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Nom" value={sub.full_name} /><Field label="Email" value={sub.email} /><Field label="Téléphone" value={sub.phone} />
                          <Field label="Entreprise" value={sub.company} /><Field label="Secteur" value={sub.sector} /><Field label="Taille" value={sub.size} />
                          <Field label="Site actuel" value={sub.current_url} /><Field label="Source" value={sub.source} />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>📋 Projet</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Field label="Type de site" value={sub.project_types} /><Field label="Mots-clés SEO" value={sub.keywords} />
                        </div>
                        {sub.description&&(<div className="mt-3"><p className="text-xs mb-1" style={{color:INK_XL}}>Description</p><p className="text-sm leading-relaxed rounded-xl p-3 whitespace-pre-wrap" style={{background:BG_INPUT,color:INK_L}}>{sub.description}</p></div>)}
                        {sub.inspiration&&(<div className="mt-3"><p className="text-xs mb-1" style={{color:INK_XL}}>Inspiration</p><p className="text-sm leading-relaxed rounded-xl p-3" style={{background:BG_INPUT,color:INK_L}}>{sub.inspiration}</p></div>)}
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>🎯 Objectifs & Budget</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Objectif" value={sub.goal} /><Field label="Budget" value={sub.budget} /><Field label="Récurrence" value={sub.recurrence} />
                          <Field label="Urgence" value={sub.urgency?sub.urgency+"/5":null} /><Field label="Acquisition" value={sub.acquisition_sources} />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>🎨 Contenu & Design</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Charte graphique" value={sub.brand} /><Field label="Contenu dispo" value={sub.content_available} />
                          <Field label="Nb de pages" value={sub.pages_count} /><Field label="Fonctionnalités" value={sub.features} /><Field label="Fonct. autre" value={sub.features_other} />
                        </div>
                        {sub.vibe&&(<div className="mt-3"><p className="text-xs mb-1" style={{color:INK_XL}}>Ambiance souhaitée</p><p className="text-sm rounded-xl p-3" style={{background:BG_INPUT,color:INK_L}}>{sub.vibe}</p></div>)}
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>⏱ Délais & Contexte</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Délai souhaité" value={sub.deadline} /><Field label="Date clé" value={sub.key_date} /><Field label="Autonomie" value={sub.autonomy} />
                          <Field label="Niveau web" value={sub.web_level?sub.web_level+"/5":null} /><Field label="Expérience agence" value={sub.past_experience} />
                          <Field label="Contact préféré" value={sub.contact_pref} /><Field label="Créneau" value={sub.time_slot} />
                        </div>
                        {sub.past_issue&&(<div className="mt-3"><p className="text-xs mb-1" style={{color:INK_XL}}>Ce qui s'est passé</p><p className="text-sm rounded-xl p-3" style={{background:BG_INPUT,color:INK_L}}>{sub.past_issue}</p></div>)}
                      </div>

                      {sub.message&&(
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>💬 Message</p>
                          <p className="text-sm rounded-xl p-3 whitespace-pre-wrap" style={{background:BG_INPUT,color:INK_L}}>{sub.message}</p>
                        </div>
                      )}

                      {sub.team_enabled&&sub.team_data&&sub.team_data.length>0&&(
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>👥 Équipe</p>
                          <div className="space-y-2">
                            {sub.team_data.map((m:any,i:number)=>(
                              <div key={i} className="rounded-xl p-3 text-sm" style={{background:BG_INPUT,color:INK_L}}>
                                <span className="font-medium" style={{color:INK}}>{m.name}</span> — {m.role}
                                {m.bio&&<p className="text-xs mt-1" style={{color:INK_XL}}>{m.bio}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {((sub.file_paths&&sub.file_paths.length>0)||sub.file_link)&&(
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>📎 Fichiers</p>
                          {sub.file_link&&(
                            <a href={sub.file_link} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl text-sm w-fit transition-colors"
                              style={{background:BG_INPUT,color:"rgb(37,99,235)"}}>
                              <ExternalLink size={14} /> Voir les fichiers partagés (Drive/Dropbox…)
                            </a>
                          )}
                          {sub.file_notes&&<p className="text-xs mb-3 italic" style={{color:INK_XL}}>{sub.file_notes}</p>}
                          {sub.file_paths&&sub.file_paths.length>0&&(
                            <div className="flex flex-wrap gap-2">
                              {sub.file_paths.map((path,i)=>(
                                <button key={i} onClick={()=>downloadFile(path)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
                                  style={{background:BG_INPUT,border:`1px solid ${BORDER}`,color:INK_L}}>
                                  <Download size={12} />{path.split("/").pop()}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t" style={{borderColor:BORDER}}>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:INK_XL}}>Statut</p>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map(s=>(
                              <button key={s} onClick={()=>updateStatus(sub.id,s)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                                style={sub.status===s?{background:INK,color:BG,borderColor:INK}:{background:"transparent",borderColor:BORDER,color:INK_L}}>
                                {STATUS_LABELS[s]?.label??s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button onClick={()=>deleteSubmission(sub.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-red-50"
                          style={{background:"rgba(180,50,50,0.06)",color:"rgba(180,50,50,0.7)"}}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          Supprimer cette soumission
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
