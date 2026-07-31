import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/common/Icons';
import { BadgeType, BadgeStatus } from '../components/common/Badge';
import { EmptyState } from '../components/common/Toast';

const accessTiers = [
  { min: 0, label: 'No Repository Access' },
  { min: 60, label: 'Idea Repository' },
  { min: 100, label: 'Internal Projects' },
  { min: 200, label: 'External Projects' }
];

export default function ProjectsPage() {
  const { currentUser } = useAuth();
  const { showToast } = useApp();

  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(true);

  // Modals
  const [modal, setModal] = useState(null); // 'submit' | 'locked' | 'detail' | 'enhancement'
  const [submitType, setSubmitType] = useState('Internal');
  const [selectedProject, setSelectedProject] = useState(null);
  const [lockedInfo, setLockedInfo] = useState({ type: '', req: 60 });
  const [commentText, setCommentText] = useState('');

  // Submit form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tech, setTech] = useState('');
  const [abstract, setAbstract] = useState('');
  const [github, setGithub] = useState('');
  const [doc, setDoc] = useState('');
  const [ppt, setPpt] = useState('');
  const [cert, setCert] = useState('');
  const [demo, setDemo] = useState('');
  const [vercel, setVercel] = useState('');
  const [faculty, setFaculty] = useState('Dr. Sarah Smith');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Enhancement form state
  const [enhTitle, setEnhTitle] = useState('');
  const [enhDetails, setEnhDetails] = useState('');
  const [enhLink, setEnhLink] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [filter, search, sort]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects', { params: { filter, search, sort } });
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = (p) => {
    if (!currentUser) return true;
    if (currentUser.role !== 'Student') return true;
    if (p.author === currentUser.name) return true;
    if (p.collaborators && p.collaborators.includes(currentUser.name)) return true;

    if ((currentUser.approved_projects || 0) < 3) return false;

    let req = 0;
    if (p.type === 'Idea') req = accessTiers[1].min;
    if (p.type === 'Internal') req = accessTiers[2].min;
    if (p.type === 'External') req = accessTiers[3].min;

    return (currentUser.credits || 0) >= req;
  };

  const handleCardClick = async (p) => {
    if (checkAccess(p)) {
      try {
        const res = await api.get(`/projects/${p.id}`);
        if (res.data.success) {
          setSelectedProject(res.data.project);
          setModal('detail');
        }
      } catch (err) {
        setSelectedProject(p);
        setModal('detail');
      }
    } else {
      let req = 60;
      if (p.type === 'Internal') req = accessTiers[2].min;
      if (p.type === 'External') req = accessTiers[3].min;
      setLockedInfo({ type: p.type, req });
      setModal('locked');
    }
  };

  const handleToggleLike = async (e, p) => {
    e.stopPropagation();
    if (!checkAccess(p)) return;
    try {
      const res = await api.post(`/projects/${p.id}/like`);
      if (res.data.success) {
        setProjects((prev) =>
          prev.map((item) =>
            item.id === p.id ? { ...item, likes: res.data.likes, liked: res.data.liked } : item
          )
        );
        if (selectedProject?.id === p.id) {
          setSelectedProject((prev) => ({ ...prev, likes: res.data.likes, liked: res.data.liked }));
        }
      }
    } catch (err) {
      showToast('Like action failed');
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedProject) return;
    try {
      const res = await api.post(`/projects/${selectedProject.id}/comments`, { text: commentText });
      if (res.data.success) {
        setSelectedProject((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), res.data.comment],
          commentsCount: res.data.commentsCount
        }));
        setCommentText('');
        showToast('Comment posted');
      }
    } catch (err) {
      showToast('Failed to post comment');
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('tech', tech);
      formData.append('abstract', abstract);
      formData.append('github', github);
      formData.append('doc', doc);
      formData.append('ppt', ppt);
      formData.append('cert', cert);
      formData.append('demo', demo);
      formData.append('vercel', vercel);
      formData.append('faculty', faculty);
      formData.append('type', submitType);

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }

      const res = await api.post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        showToast(res.data.message);
        setModal(null);
        resetSubmitForm();
        fetchProjects();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Submission failed');
    }
  };

  const resetSubmitForm = () => {
    setTitle(''); setCategory(''); setTech(''); setAbstract(''); setGithub('');
    setDoc(''); setPpt(''); setCert(''); setDemo(''); setVercel(''); setSelectedFiles([]);
  };

  const handleReport = async () => {
    if (!selectedProject) return;
    if (window.confirm(`Are you sure you want to report "${selectedProject.title}" for guidelines violation?`)) {
      try {
        const res = await api.post(`/projects/${selectedProject.id}/report`);
        if (res.data.success) {
          showToast(res.data.message);
          setModal(null);
        }
      } catch (err) {
        showToast('Report failed');
      }
    }
  };

  const handleRequestCollab = async (projectId) => {
    try {
      const res = await api.post('/collaboration/request', { projectId });
      if (res.data.success) {
        showToast('Collaboration request sent!');
        setModal(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Collaboration request failed');
    }
  };

  const handleSubmitEnhancement = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      const res = await api.post('/collaboration/enhancements', {
        projectId: selectedProject.id,
        title: enhTitle,
        details: enhDetails,
        codeLink: enhLink
      });
      if (res.data.success) {
        showToast(res.data.message);
        setModal(null);
        setEnhTitle(''); setEnhDetails(''); setEnhLink('');
      }
    } catch (err) {
      showToast('Enhancement submission failed');
    }
  };

  const tabs = [['all', 'All'], ['internal', 'Internal'], ['external', 'External'], ['idea', 'Ideas']];
  const sortOptions = [['latest', 'Latest'], ['views', 'Most Viewed'], ['credits', 'Highest Credits'], ['popular', 'Most Popular']];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Projects Repository</h1>
          <p>Browse internal, external, and idea submissions across the platform.</p>
        </div>
        {currentUser?.role === 'Student' && (
          <button className="btn btn-primary" onClick={() => { setSubmitType('Internal'); setModal('submit'); }}>
            <Icon name="plus" size={16} /> Submit Project
          </button>
        )}
      </div>

      <div className="toolbar">
        <div className="tabs">
          {tabs.map(([id, label]) => (
            <div key={id} className={`tab ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>
              {label}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div className="search-wrap">
            <Icon name="search2" size={16} />
            <input
              className="search-input"
              placeholder="Search title, student, dept, tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="field"
            style={{ width: 'auto', border: '1px solid var(--border)', borderRadius: '10px', padding: '9px 12px', fontSize: '13.5px', background: 'rgba(3,7,18,0.4)', color: '#fff', margin: 0 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {sortOptions.map(([v, l]) => (
              <option key={v} value={v}>Sort: {l}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)', padding: '40px' }}>Loading projects...</div>
      ) : projects.length ? (
        <div className="proj-grid">
          {projects.map((p) => {
            const hasAccess = checkAccess(p);
            return (
              <div
                key={p.id}
                className={`card proj-card${hasAccess ? '' : ' locked'}`}
                onClick={() => handleCardClick(p)}
                style={{ position: 'relative' }}
              >
                {!hasAccess && (
                  <div className="lock-overlay-icon">
                    <Icon name="lock" size={14} />
                  </div>
                )}
                <div className="proj-top">
                  <div className="proj-badges">
                    <BadgeType type={p.type} />
                    <BadgeStatus status={p.status} />
                  </div>
                  <div className="proj-cat" style={{ marginRight: '20px' }}>{p.category}</div>
                </div>
                <div className="proj-title" style={{ marginTop: '6px' }}>{p.title}</div>
                <div className="proj-by">by <span className="clickable-name">{p.author}</span> &middot; {p.dept}</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {(p.tech || []).map((t, idx) => (
                    <span key={idx} className="badge badge-gray" style={{ fontSize: '10px', padding: '1px 5px' }}>{t}</span>
                  ))}
                </div>
                <div className="proj-stats" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                  <button className={p.liked ? 'liked' : ''} onClick={(e) => handleToggleLike(e, p)}>
                    <Icon name={p.liked ? 'heartFilled' : 'heart'} size={15} /> {p.likes}
                  </button>
                  <span><Icon name="comment" size={15} /> {p.commentsCount || (p.comments ? p.comments.length : 0)}</span>
                  <span><Icon name="eye" size={15} /> {p.views}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState msg="No projects match your search criteria." ic="search2" />
      )}

      {/* MODAL: SUBMIT PROJECT */}
      {modal === 'submit' && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ width: '500px' }}>
            <h3>Submit Project</h3>
            <p className="hint">
              {submitType === 'Internal'
                ? 'Internal academic projects are auto-assigned a faculty reviewer — no guide request needed.'
                : 'External projects need a faculty guide to accept your request before review.'}
            </p>
            <div className="tabs" style={{ marginBottom: '16px' }}>
              <div className={`tab ${submitType === 'Internal' ? 'active' : ''}`} onClick={() => setSubmitType('Internal')}>Internal Project</div>
              <div className={`tab ${submitType === 'External' ? 'active' : ''}`} onClick={() => setSubmitType('External')}>External Project</div>
            </div>
            <form onSubmit={handleSubmitProject}>
              <div className="field"><label>Project title</label><input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Smart Attendance Tracker" /></div>
              <div className="field"><label>Domain / Category</label><input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Machine Learning" /></div>
              <div className="field"><label>Technologies (comma separated)</label><input required value={tech} onChange={(e) => setTech(e.target.value)} placeholder="e.g. React, Python, Flask" /></div>
              <div className="field"><label>Abstract</label><textarea required rows="2" value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Short summary of the project"></textarea></div>
              <div className="field"><label>GitHub repository</label><input required value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." /></div>
              <div className="field"><label>Documentation link</label><input required value={doc} onChange={(e) => setDoc(e.target.value)} placeholder="Link to report / docs" /></div>
              {submitType === 'Internal' ? (
                <div className="field"><label>PPT link</label><input required value={ppt} onChange={(e) => setPpt(e.target.value)} placeholder="Link to presentation" /></div>
              ) : (
                <div className="field"><label>Certificate (optional)</label><input value={cert} onChange={(e) => setCert(e.target.value)} placeholder="Link to certificate" /></div>
              )}
              <div className="field"><label>Demo video (optional)</label><input value={demo} onChange={(e) => setDemo(e.target.value)} placeholder="YouTube / Drive link" /></div>
              <div className="field"><label>Vercel link (optional)</label><input value={vercel} onChange={(e) => setVercel(e.target.value)} placeholder="https://your-app.vercel.app" /></div>
              <div className="field">
                <label>Upload Documents / Code (Multer file storage)</label>
                <input type="file" multiple onChange={(e) => setSelectedFiles(e.target.files)} style={{ padding: '6px' }} />
              </div>
              <div className="field">
                <label>Faculty Reviewer / Guide</label>
                <select value={faculty} onChange={(e) => setFaculty(e.target.value)} style={{ background: 'rgba(3,7,18,0.4)', color: '#fff' }}>
                  <option>Dr. Sarah Smith</option>
                  <option>Dr. Rajesh Kumar</option>
                  <option>Dr. Anita Verma</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{submitType === 'Internal' ? 'Submit for review' : 'Send guide request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOCKED */}
      {modal === 'locked' && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ textAlign: 'center', padding: '34px 26px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.12)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', border: '1px solid rgba(244,63,94,0.2)' }}>
              <Icon name="lock" size={24} />
            </div>
            <h3 style={{ marginBottom: '8px' }}>Repository Locked</h3>
            <p className="hint" style={{ marginBottom: '20px', lineHeight: 1.55 }}>
              Access to <b>{lockedInfo.type} Projects</b> requires a student to have:
              <br />1. At least <b>3 approved projects</b> (You have: <b>{currentUser?.approved_projects || 0}</b> {(currentUser?.approved_projects || 0) >= 3 ? '✅' : '❌'})
              <br />2. At least <b>{lockedInfo.req} credit points</b> (You have: <b>{currentUser?.credits || 0}</b> {(currentUser?.credits || 0) >= lockedInfo.req ? '✅' : '❌'})
            </p>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', fontSize: '12.5px', color: 'var(--muted)', marginBottom: '20px', textAlign: 'left' }}>
              💡 <b>How to unlock:</b> Submit projects for faculty review, publish project ideas, receive likes, or collaborate on enhancements.
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setModal(null)}>
              Understood
            </button>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL */}
      {modal === 'detail' && selectedProject && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <div className="proj-badges" style={{ marginBottom: '6px' }}>
                  <BadgeType type={selectedProject.type} />
                  <BadgeStatus status={selectedProject.status} />
                </div>
                <h3 style={{ margin: 0, fontSize: '20px', lineHeight: 1.25 }}>{selectedProject.title}</h3>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                  by <span className="clickable-name">{selectedProject.author}</span> &middot; {selectedProject.dept}
                </div>
              </div>
              <button className="icon-btn" onClick={() => setModal(null)}><Icon name="x" size={20} /></button>
            </div>

            <div style={{ fontSize: '13.5px', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '18px' }}>
              <b>Abstract / Description:</b><br />
              {selectedProject.abstract || selectedProject.description || 'No description provided.'}
            </div>

            <div style={{ marginBottom: '18px' }}>
              <b>Technologies Used:</b>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {(selectedProject.tech || []).map((t, idx) => (
                  <span key={idx} className="badge badge-gray">{t}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <b>Repository & Links:</b>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px', fontSize: '13px' }}>
                {selectedProject.github && <a href={selectedProject.github} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="folder" size={14} /> GitHub Code</a>}
                {selectedProject.doc && <a href={selectedProject.doc} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="book" size={14} /> Documentation</a>}
                {selectedProject.ppt && <a href={selectedProject.ppt} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="award" size={14} /> Presentation (PPT)</a>}
                {selectedProject.cert && <a href={selectedProject.cert} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="award" size={14} /> Certificate</a>}
                {selectedProject.demo && <a href={selectedProject.demo} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="eye" size={14} /> Demo Video</a>}
                {selectedProject.vercel && <a href={selectedProject.vercel} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="trend" size={14} /> Vercel Link</a>}
              </div>
            </div>

            <div style={{ marginBottom: '18px', fontSize: '14px', color: '#cbd5e1' }}>
              <b>Collaborators:</b> {selectedProject.collaborators && selectedProject.collaborators.length ? selectedProject.collaborators.join(', ') : 'None'}
            </div>

            {selectedProject.enhancements && selectedProject.enhancements.length > 0 && (
              <div style={{ marginBottom: '18px', background: 'rgba(16,185,129,0.06)', color: '#34d399', borderRadius: '10px', padding: '12px', fontSize: '13.5px', border: '1px solid rgba(16,185,129,0.15)' }}>
                <b>Approved Enhancements:</b>
                {selectedProject.enhancements.map((e, idx) => (
                  <div key={idx} style={{ marginTop: '4px', borderTop: '1px solid rgba(16,185,129,0.15)', paddingTop: '4px' }}>
                    <b>{e.title}</b> by {e.author}: {e.details}
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '18px', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-outline btn-sm" onClick={handleReport}><Icon name="bell" size={14} /> Report</button>
                {currentUser?.role === 'Student' && currentUser?.name !== selectedProject.author && !(selectedProject.collaborators || []).includes(currentUser?.name) && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleRequestCollab(selectedProject.id)}><Icon name="plus" size={14} /> Request Collaboration</button>
                )}
                {currentUser?.role === 'Student' && (selectedProject.collaborators || []).includes(currentUser?.name) && (
                  <button className="btn btn-primary btn-sm" onClick={() => setModal('enhancement')}><Icon name="plus" size={14} /> Submit Enhancement</button>
                )}
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal(null)}>Close</button>
            </div>

            <div className="comment-section">
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                <span>Comments ({selectedProject.comments ? selectedProject.comments.length : 0})</span>
              </div>
              <div className="comment-list">
                {selectedProject.comments && selectedProject.comments.length ? (
                  selectedProject.comments.map((c, idx) => (
                    <div key={idx} className="comment-bubble">
                      <div className="comment-author">{c.author}<span className="comment-time">{c.time}</span></div>
                      <div className="comment-text">{c.text}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>No comments yet.</p>
                )}
              </div>
              {currentUser && (
                <form className="comment-form" onSubmit={handlePostComment}>
                  <textarea
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                  ></textarea>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px 12px', height: '40px' }}>Post</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ENHANCEMENT */}
      {modal === 'enhancement' && selectedProject && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h3>Submit Project Enhancement</h3>
            <p className="hint">Propose code improvements on "{selectedProject.title}" for guide review.</p>
            <form onSubmit={handleSubmitEnhancement}>
              <div className="field"><label>Enhancement Title</label><input required value={enhTitle} onChange={(e) => setEnhTitle(e.target.value)} placeholder="e.g. Added face spoofing detection" /></div>
              <div className="field"><label>Details of Enhancement</label><textarea required value={enhDetails} onChange={(e) => setEnhDetails(e.target.value)} rows="3" placeholder="Explain your code improvements..."></textarea></div>
              <div className="field"><label>Pull Request / Code Link</label><input required value={enhLink} onChange={(e) => setEnhLink(e.target.value)} placeholder="https://github.com/.../pull/..." /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit for Faculty Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
