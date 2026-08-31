import React, { useState } from 'react';
import { Music, Upload, Zap, Sliders, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const Index = () => {
  const [inputMode, setInputMode] = useState('text');
  const [lyrics, setLyrics] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bpm, setBpm] = useState(120);
  const [duration, setDuration] = useState(180);
  const [stemSeparation, setStemSeparation] = useState(false);
  const [hint, setHint] = useState('');
  const [generatingLyrics, setGeneratingLyrics] = useState(false);

  const allTags = [
    // Era
    { category: 'Era', tags: ['2020s', '2010s', '1990s', '1980s', '2000s'] },
    // Genre
    { category: 'Genre', tags: ['pop', 'rap', 'afrobeats', 'rock', 'jazz', 'electronic', 'hip-hop', 'r&b', 'indie', 'country', 'reggae', 'soul'] },
    // Mood
    { category: 'Mood', tags: ['energetic', 'melancholic', 'romantic', 'chill', 'intense', 'uplifting', 'dark', 'playful'] },
    // Instruments
    { category: 'Instruments', tags: ['guitar', 'piano', 'drums', 'strings', 'synth', 'bass', 'flute', 'violin'] },
    // Vocal
    { category: 'Vocal', tags: ['male vocalist', 'female vocalist', 'instrumental', 'duo', 'choir'] }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const generateLyricsAI = async () => {
    if (!hint.trim()) return;
    
    setGeneratingLyrics(true);
    try {
      // Call AI lyrics generation edge function
      const response = await fetch('/api/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hint,
          tags: selectedTags,
          genre: selectedTags.find(t => ['pop', 'rap', 'rock', 'jazz', 'electronic', 'afrobeats'].includes(t)) || 'pop',
          mood: selectedTags.find(t => ['energetic', 'melancholic', 'romantic', 'chill', 'intense'].includes(t)) || 'energetic'
        })
      });
      
      const data = await response.json();
      setLyrics(data.lyrics || '');
      setInputMode('lyrics');
    } catch (error) {
      console.error('Failed to generate lyrics:', error);
    } finally {
      setGeneratingLyrics(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-8 h-8 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Hwiriko Visual Setter</h1>
          </div>
          <p className="text-muted-foreground text-lg">Create unique music with AI in seconds</p>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-8">
          
          {/* Section 1: Input Mode */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Input Type
            </h2>
            <Tabs value={inputMode} onValueChange={setInputMode} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
                <TabsTrigger value="hint">Hint</TabsTrigger>
                <TabsTrigger value="voice">Voice</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4 mt-4">
                <Textarea 
                  placeholder="Describe the music you want to create..."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="min-h-32"
                />
              </TabsContent>
              
              <TabsContent value="lyrics" className="space-y-4 mt-4">
                <Textarea 
                  placeholder="Paste your custom lyrics here..."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="min-h-32"
                />
              </TabsContent>
              
              <TabsContent value="hint" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Enter a hint or theme for AI to generate lyrics (e.g., 'A song about overcoming challenges')..."
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    className="min-h-24"
                  />
                  <Button 
                    onClick={generateLyricsAI}
                    disabled={!hint.trim() || generatingLyrics}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {generatingLyrics ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Generating Lyrics...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="voice" className="space-y-4 mt-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Upload your voice for cloning</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Section 2: Style Tags */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Music className="w-5 h-5" /> Style Tags
            </h2>
            
            <div className="space-y-4">
              {allTags.map((group) => (
                <div key={group.category} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {selectedTags.length > 0 && (
              <div className="bg-secondary/10 border border-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Advanced Options */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sliders className="w-5 h-5" /> Advanced
            </h2>
            
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <p className="text-sm font-medium text-foreground mb-3">Voice Clone</p>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Upload your voice</p>
                </div>
              </div>

              <div className="border-b border-border pb-4">
                <p className="text-sm font-medium text-foreground mb-3">Artist Style</p>
                <input 
                  type="text"
                  placeholder="e.g., like Burna Boy"
                  className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">BPM</p>
                  <div className="flex items-center gap-3">
                    <Slider 
                      value={[bpm]} 
                      onValueChange={(v) => setBpm(v[0])}
                      min={60}
                      max={180}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold text-accent w-12">{bpm}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Key</p>
                  <select className="w-full bg-secondary/20 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                    <option>C Major</option>
                    <option>C Minor</option>
                    <option>G Major</option>
                    <option>D Major</option>
                    <option>A Major</option>
                    <option>E Major</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Duration</p>
                  <div className="flex items-center gap-3">
                    <Slider 
                      value={[duration]} 
                      onValueChange={(v) => setDuration(v[0])}
                      min={30}
                      max={300}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold text-accent w-12">{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">Stem Separation</p>
                      <Switch checked={stemSeparation} onCheckedChange={setStemSeparation} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            size="lg" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6 rounded-lg transition-all hover:shadow-lg"
          >
            <Music className="w-5 h-5 mr-2" />
            Generate Music
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
