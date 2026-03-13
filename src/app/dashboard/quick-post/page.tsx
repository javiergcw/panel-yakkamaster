'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ImageIcon from '@mui/icons-material/Image';
import AddIcon from '@mui/icons-material/Add';
import {
  GetQuickPostsUseCase,
  GetQuickPostByIdUseCase,
  CreateQuickPostUseCase,
  UpdateQuickPostUseCase,
  QuickPostsService,
  type QuickPost,
  type QuickPostsResponse,
} from '@/modules/quick-posts';
import { FetchErrorState } from '@/components/FetchErrorState';

const quickPostsService = new QuickPostsService();
const getQuickPostsUseCase = new GetQuickPostsUseCase(quickPostsService);
const getQuickPostByIdUseCase = new GetQuickPostByIdUseCase(quickPostsService);
const createQuickPostUseCase = new CreateQuickPostUseCase(quickPostsService);
const updateQuickPostUseCase = new UpdateQuickPostUseCase(quickPostsService);

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function QuickPostCard({
  post,
  onOpenDetail,
}: {
  post: QuickPost;
  onOpenDetail: (post: QuickPost) => void;
}) {
  const isPublic = post.visibility === 'PUBLIC';

  return (
    <Card
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        },
      }}
      onClick={() => onOpenDetail(post)}
    >
      {/* Header: avatar placeholder + visibility + time */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #f5f5f7',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#66bb6a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1d1d1f' }}>
              Quick Post
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#86868b' }}>
              {formatDate(post.created_at)}
            </Typography>
          </Box>
        </Box>
        <Chip
          size="small"
          icon={isPublic ? <PublicIcon sx={{ fontSize: 14 }} /> : <LockIcon sx={{ fontSize: 14 }} />}
          label={post.visibility}
          sx={{
            bgcolor: isPublic ? '#e8f5e9' : '#f5f5f7',
            color: isPublic ? '#2e7d32' : '#616161',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
      </Box>

      {/* Photo */}
      {post.photo_url ? (
        <CardMedia
          component="img"
          height="320"
          image={post.photo_url}
          alt=""
          sx={{
            objectFit: 'cover',
            bgcolor: '#fafafa',
          }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            bgcolor: '#f5f5f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: '#d0d0d0' }} />
        </Box>
      )}

      {/* Caption */}
      <CardContent sx={{ py: 1.5, px: 2 }}>
        {post.caption ? (
          <Typography
            sx={{
              fontSize: '0.9375rem',
              color: '#1d1d1f',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.caption}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: '0.875rem', color: '#86868b', fontStyle: 'italic' }}>
            No caption
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function QuickPostPage() {
  const [data, setData] = useState<QuickPostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailPost, setDetailPost] = useState<QuickPost | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createCaption, setCreateCaption] = useState('');
  const [createIsActive, setCreateIsActive] = useState(true);
  const [createVisibility, setCreateVisibility] = useState(true);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [detailVisibilityUpdating, setDetailVisibilityUpdating] = useState(false);

  const loadPosts = useCallback(() => {
    setError(null);
    setLoading(true);
    getQuickPostsUseCase
      .execute()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load quick posts')
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleOpenDetail = (post: QuickPost) => {
    setDetailPost(post);
    setDetailLoading(true);
    getQuickPostByIdUseCase
      .execute(post.id)
      .then(setDetailPost)
      .catch(() => setDetailPost(post))
      .finally(() => setDetailLoading(false));
  };

  const handleOpenCreate = () => {
    setCreateImage(null);
    setCreateCaption('');
    setCreateIsActive(true);
    setCreateVisibility(true);
    setCreateError(null);
    setOpenCreate(true);
  };

  const handleDetailVisibilityChange = (post: QuickPost, newVisible: boolean) => {
    setDetailVisibilityUpdating(true);
    const formData = new FormData();
    formData.append('caption', post.caption ?? '');
    formData.append('is_active', post.is_active ? 'true' : 'false');
    formData.append('visibility', newVisible ? 'true' : 'false');
    updateQuickPostUseCase
      .execute(post.id, formData)
      .then((updated) => {
        setDetailPost(updated);
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            quick_posts: prev.quick_posts.map((p) => (p.id === updated.id ? updated : p)),
          };
        });
      })
      .catch(() => {})
      .finally(() => setDetailVisibilityUpdating(false));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createImage) {
      setCreateError('Select an image');
      return;
    }
    setCreateError(null);
    setCreateSubmitting(true);
    const formData = new FormData();
    formData.append('image', createImage);
    formData.append('caption', createCaption);
    formData.append('is_active', createIsActive ? 'true' : 'false');
    formData.append('visibility', createVisibility ? 'true' : 'false');
    createQuickPostUseCase
      .execute(formData)
      .then(() => {
        setOpenCreate(false);
        loadPosts();
      })
      .catch((err) =>
        setCreateError(err instanceof Error ? err.message : 'Error creating post')
      )
      .finally(() => setCreateSubmitting(false));
  };

  if (loading) {
    return (
      <Box>
        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Skeleton variant="text" width={160} height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={80} height={24} />
          </Box>
          <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: '8px' }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} sx={{ bgcolor: '#ffffff', borderRadius: '16px', boxShadow: 'none', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid #f5f5f7' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box>
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width={50} height={16} />
                  </Box>
                </Box>
                <Skeleton variant="rounded" width={60} height={24} />
              </Box>
              <Skeleton variant="rectangular" height={200} sx={{ bgcolor: '#f5f5f7' }} />
              <CardContent sx={{ py: 1.5, px: 2 }}>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="85%" height={20} />
                <Skeleton variant="text" width="70%" height={20} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return <FetchErrorState message={error} onRetry={loadPosts} />;
  }

  const posts = data?.quick_posts ?? [];
  const total = data?.total ?? posts.length;

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              color: '#1d1d1f',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              letterSpacing: '-1px',
              mb: 1,
            }}
          >
            Quick Post
          </Typography>
          <Typography sx={{ color: '#86868b', fontSize: '0.9375rem', fontWeight: 400 }}>
            {total} {total === 1 ? 'post' : 'posts'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            bgcolor: '#66bb6a',
            color: '#fff',
            '&:hover': { bgcolor: '#5cb860', color: '#fff' },
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          New post
        </Button>
      </Box>

      {posts.length === 0 ? (
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 6,
            textAlign: 'center',
          }}
        >
          <ImageIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
          <Typography sx={{ color: '#86868b', fontSize: '0.9375rem' }}>
            No quick posts yet.
          </Typography>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {posts.map((post) => (
            <QuickPostCard key={post.id} post={post} onOpenDetail={handleOpenDetail} />
          ))}
        </Box>
      )}

      {/* Detail modal */}
      <Dialog
        open={!!detailPost}
        onClose={() => setDetailPost(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px', overflow: 'hidden' },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            px: 2,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1d1d1f' }}>
            Quick Post
          </Typography>
          <IconButton onClick={() => setDetailPost(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {detailLoading ? (
            <Box sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: '8px', mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Skeleton variant="rounded" width={80} height={24} />
              </Box>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="70%" height={20} />
            </Box>
          ) : detailPost ? (
            <>
              {detailPost.photo_url && (
                <Box
                  component="img"
                  src={detailPost.photo_url}
                  alt=""
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              )}
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    icon={
                      detailPost.visibility === 'PUBLIC' ? (
                        <PublicIcon sx={{ fontSize: 14 }} />
                      ) : (
                        <LockIcon sx={{ fontSize: 14 }} />
                      )
                    }
                    label={detailPost.visibility}
                    sx={{
                      bgcolor:
                        detailPost.visibility === 'PUBLIC' ? '#e8f5e9' : '#f5f5f7',
                      color:
                        detailPost.visibility === 'PUBLIC' ? '#2e7d32' : '#616161',
                      fontWeight: 600,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#86868b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: 14 }} />
                    {formatDate(detailPost.created_at)}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={detailPost.visibility === 'PUBLIC'}
                        onChange={(_, checked) =>
                          handleDetailVisibilityChange(detailPost, checked)
                        }
                        disabled={detailVisibilityUpdating}
                        color="primary"
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#66bb6a' },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.875rem', color: '#616161' }}>
                        {detailVisibilityUpdating ? 'Updating…' : 'Visible'}
                      </Typography>
                    }
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    color: '#1d1d1f',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {detailPost.caption || 'No caption'}
                </Typography>
              </Box>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Create quick post modal */}
      <Dialog
        open={openCreate}
        onClose={() => !createSubmitting && setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            px: 2,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1d1d1f' }}>
            New Quick Post
          </Typography>
          <IconButton
            onClick={() => !createSubmitting && setOpenCreate(false)}
            size="small"
            disabled={createSubmitting}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box component="form" onSubmit={handleCreateSubmit} noValidate>
            {createError && (
              <Typography
                sx={{ color: 'error.main', fontSize: '0.875rem', mb: 2 }}
              >
                {createError}
              </Typography>
            )}
            <InputLabel sx={{ mb: 0.5, display: 'block', fontSize: '0.875rem' }}>
              Image *
            </InputLabel>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                mb: 2,
                py: 1.5,
                borderStyle: 'dashed',
                borderColor: '#ccc',
                color: '#666',
              }}
            >
              {createImage ? createImage.name : 'Select image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setCreateImage(e.target.files?.[0] ?? null)}
              />
            </Button>
            <TextField
              label="Caption"
              multiline
              rows={3}
              value={createCaption}
              onChange={(e) => setCreateCaption(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={createIsActive}
                  onChange={(_, v) => setCreateIsActive(v)}
                  color="primary"
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#66bb6a' } }}
                />
              }
              label="Active"
              sx={{ mb: 1, display: 'block' }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={createVisibility}
                  onChange={(_, v) => setCreateVisibility(v)}
                  color="primary"
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#66bb6a' } }}
                />
              }
              label="Visible"
              sx={{ mb: 2, display: 'block' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                onClick={() => setOpenCreate(false)}
                disabled={createSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createSubmitting}
                sx={{
                  bgcolor: '#66bb6a',
                  color: '#fff',
                  '&:hover': { bgcolor: '#5cb860', color: '#fff' },
                }}
              >
                {createSubmitting ? 'Creating…' : 'Create'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
