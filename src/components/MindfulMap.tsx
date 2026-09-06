import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Compass,
  Sparkles,
  BookOpen,
  Plus,
  Info,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { MindfulLocation, JournalSession, Language } from '../types';
import { saveMindfulPlaceToFirestore, fetchUserMindfulPlaces } from '../lib/firebase';

interface MindfulMapProps {
  userId?: string;
  journals: JournalSession[];
  onStartReflectionAtLocation: (loc: MindfulLocation) => void;
  lang: Language;
}

// Curated peaceful and serene spots around the world for mindful reflection
const DEFAULT_MINDFUL_SPOTS: MindfulLocation[] = [
  {
    id: 'spot-lodhi',
    title: 'Lodhi Botanical Sanctuary',
    category: 'Botanical Garden',
    description: 'Tranquil centuries-old heritage trees and expansive green lawns for silent walking meditation.',
    lat: 28.5933,
    lng: 77.2197,
    reflectionPrompt: 'Notice the stillness beneath the ancient trees. What weight can you leave behind today?',
  },
  {
    id: 'spot-kyoto',
    title: 'Ryoan-ji Zen Stone Garden',
    category: 'Zen Sanctuary',
    description: 'Dry landscape garden with 15 moss-framed boulders inviting contemplation of empty space and calm.',
    lat: 35.0345,
    lng: 135.7182,
    reflectionPrompt: 'Reflect on simplicity and spaciousness. Where in your life can you create empty breathing room?',
  },
  {
    id: 'spot-central-park',
    title: 'Ramble & Conservatory Water',
    category: 'Forest Oasis',
    description: 'Dense woodland pathways, gentle streams, and secluded rustic shelters in the heart of the city.',
    lat: 40.7766,
    lng: -73.9691,
    reflectionPrompt: 'Even amidst urban noise, stillness is accessible within. What anchor connects you right now?',
  },
  {
    id: 'spot-ggp',
    title: 'Japanese Tea Garden & Moon Bridge',
    category: 'Water Sanctuary',
    description: 'Stepped stepping-stones, koi ponds, and bonsai canopies designed to evoke inner harmony.',
    lat: 37.7701,
    lng: -122.4701,
    reflectionPrompt: 'Water adapts to every shape without losing its essence. How can you soften your resistance?',
  },
  {
    id: 'spot-hydepark',
    title: 'Serpentine Silent Glade',
    category: 'Lakeside Retreat',
    description: 'Quiet lakeside willow trees with peaceful waterfowl and wide open skies.',
    lat: 51.5055,
    lng: -0.1667,
    reflectionPrompt: 'Look upon the vast open horizon. Breathe in spaciousness; exhale tension.',
  },
];

export const MindfulMap: React.FC<MindfulMapProps> = ({
  userId,
  journals,
  onStartReflectionAtLocation,
  lang,
}) => {
  const apiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const [places, setPlaces] = useState<MindfulLocation[]>(DEFAULT_MINDFUL_SPOTS);
  const [selectedPlace, setSelectedPlace] = useState<MindfulLocation | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'spots' | 'journals'>('all');
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceTitle, setNewPlaceTitle] = useState('');
  const [newPlaceDesc, setNewPlaceDesc] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState('Personal Haven');
  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load user saved places from cloud if logged in
  useEffect(() => {
    if (userId) {
      fetchUserMindfulPlaces(userId)
        .then((userPlaces) => {
          if (userPlaces.length > 0) {
            setPlaces((prev) => {
              const ids = new Set(prev.map((p) => p.id));
              const additions = userPlaces.filter((p) => !ids.has(p.id));
              return [...prev, ...additions];
            });
          }
        })
        .catch((e) => console.warn('User places fetch deferred:', e));
    }
  }, [userId]);

  // Extract geotagged journal reflections
  const geotaggedJournals = journals.filter((j) => j.location && j.location.lat && j.location.lng);

  const handleMapClick = (e: any) => {
    if (e.detail?.latLng) {
      const { lat, lng } = e.detail.latLng;
      setClickedLatLng({ lat, lng });
      setIsAddingPlace(true);
    }
  };

  const handleSaveCustomPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceTitle.trim() || !clickedLatLng) return;

    const newLoc: MindfulLocation = {
      id: `place-${Date.now()}`,
      title: newPlaceTitle.trim(),
      description: newPlaceDesc.trim() || 'A personal serene space for mindful journaling.',
      category: newPlaceCategory,
      lat: clickedLatLng.lat,
      lng: clickedLatLng.lng,
      reflectionPrompt: `Reflect on the peaceful atmosphere of ${newPlaceTitle.trim()}.`,
    };

    setPlaces((prev) => [newLoc, ...prev]);
    setSelectedPlace(newLoc);

    if (userId) {
      try {
        await saveMindfulPlaceToFirestore(userId, newLoc);
      } catch (err) {
        console.warn('Deferred places save:', err);
      }
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsAddingPlace(false);
      setNewPlaceTitle('');
      setNewPlaceDesc('');
      setClickedLatLng(null);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 font-serif">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-[#e0e0d5] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#5A5A40]" />
            <h2 className="text-2xl font-bold tracking-tight text-[#4a4a3a]">
              {lang === 'hi' ? 'माइंडफुल स्थान व ध्यान मानचित्र' : 'Mindful Spaces & Reflection Map'}
            </h2>
          </div>
          <p className="text-xs italic text-[#7a7a6a] mt-0.5">
            {lang === 'hi'
              ? 'शांतिपूर्ण प्राकृतिक अभयारण्यों का अन्वेषण करें, अपने चिंतन को जियोटैग करें और ध्यान केंद्र खोजें।'
              : 'Explore peaceful sanctuaries, geotag your reflections, and anchor mindfulness in physical space with Google Maps Platform.'}
          </p>
        </div>

        {/* View Filters & Add Spot Button */}
        <div className="flex items-center gap-2 font-sans text-xs">
          <div className="flex items-center rounded-full bg-white border border-[#d8d8cc] p-0.5 shadow-2xs">
            <button
              id="filter-map-all"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#5A5A40] text-white font-semibold shadow-2xs'
                  : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
              }`}
            >
              {lang === 'hi' ? 'सभी' : 'All'} ({places.length + geotaggedJournals.length})
            </button>
            <button
              id="filter-map-spots"
              onClick={() => setActiveFilter('spots')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'spots'
                  ? 'bg-[#5A5A40] text-white font-semibold shadow-2xs'
                  : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
              }`}
            >
              {lang === 'hi' ? 'शांति स्थल' : 'Sanctuaries'} ({places.length})
            </button>
            <button
              id="filter-map-journals"
              onClick={() => setActiveFilter('journals')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'journals'
                  ? 'bg-[#5A5A40] text-white font-semibold shadow-2xs'
                  : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
              }`}
            >
              {lang === 'hi' ? 'चिंतन प्रविष्टियां' : 'My Reflections'} ({geotaggedJournals.length})
            </button>
          </div>

          <button
            id="btn-add-mindful-spot"
            onClick={() => {
              setIsAddingPlace(!isAddingPlace);
              if (!clickedLatLng) {
                setClickedLatLng({ lat: 28.5933, lng: 77.2197 });
              }
            }}
            className="flex items-center gap-1.5 rounded-full bg-[#5A5A40] px-3.5 py-1.5 text-white shadow-2xs hover:bg-[#484833] transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{lang === 'hi' ? 'नया स्थल जोड़ें' : 'Add Spot'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="mt-6 rounded-[28px] border border-[#d8d8cc] bg-white overflow-hidden shadow-sm">
        <div className="relative w-full h-[520px]">
          <APIProvider apiKey={apiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={{ lat: 28.5933, lng: 77.2197 }}
              defaultZoom={4}
              gestureHandling="greedy"
              disableDefaultUI={false}
              onClick={handleMapClick}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
            >
              {/* Render Curated Mindful Sanctuaries */}
              {(activeFilter === 'all' || activeFilter === 'spots') &&
                places.map((place) => (
                  <AdvancedMarker
                    key={place.id}
                    position={{ lat: place.lat, lng: place.lng }}
                    onClick={() => setSelectedPlace(place)}
                    title={place.title}
                  >
                    <Pin
                      background="#5A5A40"
                      glyphColor="#f5f5f0"
                      borderColor="#3d3d2a"
                      scale={1.1}
                    />
                  </AdvancedMarker>
                ))}

              {/* Render User's Geotagged Journal Reflections */}
              {(activeFilter === 'all' || activeFilter === 'journals') &&
                geotaggedJournals.map((journal) => {
                  const loc = journal.location!;
                  return (
                    <AdvancedMarker
                      key={`j-${journal.id}`}
                      position={{ lat: loc.lat, lng: loc.lng }}
                      onClick={() =>
                        setSelectedPlace({
                          id: journal.id,
                          title: journal.title,
                          category: 'Journal Reflection',
                          description:
                            journal.summary ||
                            journal.messages[1]?.text ||
                            'Personal mindful reflection written at this location.',
                          lat: loc.lat,
                          lng: loc.lng,
                          reflectionPrompt: 'Revisit your thoughts and insights logged at this location.',
                        })
                      }
                      title={`Reflection: ${journal.title}`}
                    >
                      <Pin
                        background="#7c8a6e"
                        glyphColor="#ffffff"
                        borderColor="#556349"
                        scale={1.15}
                      />
                    </AdvancedMarker>
                  );
                })}

              {/* Temporary Marker when user is adding a place */}
              {isAddingPlace && clickedLatLng && (
                <AdvancedMarker position={clickedLatLng}>
                  <Pin background="#b45309" glyphColor="#ffffff" borderColor="#78350f" scale={1.2} />
                </AdvancedMarker>
              )}

              {/* Info Window for Selected Spot */}
              {selectedPlace && (
                <InfoWindow
                  position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div className="max-w-xs p-2 font-serif text-[#4a4a3a]">
                    <div className="flex items-center gap-1.5 text-xs text-[#5A5A40] font-sans font-semibold">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{selectedPlace.category}</span>
                    </div>
                    <h4 className="mt-1 text-base font-bold text-[#4a4a3a]">
                      {selectedPlace.title}
                    </h4>
                    <p className="mt-1 text-xs text-[#6a6a5a] leading-relaxed">
                      {selectedPlace.description}
                    </p>

                    {selectedPlace.reflectionPrompt && (
                      <div className="mt-2.5 rounded-xl bg-[#f5f5f0] p-2 text-[11px] italic text-[#5A5A40] border border-[#e0e0d5]">
                        "{selectedPlace.reflectionPrompt}"
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-[#e0e0d5] flex items-center justify-between font-sans text-xs">
                      <span className="text-[10px] text-[#8a8a7a]">
                        {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}
                      </span>
                      <button
                        id="btn-reflect-at-location"
                        onClick={() => {
                          onStartReflectionAtLocation(selectedPlace);
                          setSelectedPlace(null);
                        }}
                        className="flex items-center gap-1 text-[#5A5A40] font-semibold hover:underline"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>{lang === 'hi' ? 'यहाँ चिंतन करें' : 'Reflect Here'}</span>
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Quick Location Cards Grid */}
        <div className="p-4 sm:p-6 border-t border-[#e0e0d5] bg-[#fafaf7]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#5A5A40] font-sans mb-3">
            {lang === 'hi' ? 'सुझाए गए शांति स्थल' : 'Curated Sanctuaries & Reflection Points'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {places.slice(0, 3).map((spot) => (
              <div
                key={spot.id}
                onClick={() => setSelectedPlace(spot)}
                className="cursor-pointer rounded-2xl border border-[#e0e0d5] bg-white p-3.5 hover:border-[#5A5A40] hover:shadow-2xs transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5A5A40] font-sans font-semibold">
                  <span>{spot.category}</span>
                  <MapPin className="h-3 w-3" />
                </div>
                <h4 className="mt-1 text-sm font-bold text-[#4a4a3a]">{spot.title}</h4>
                <p className="mt-1 text-xs text-[#7a7a6a] line-clamp-2">{spot.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartReflectionAtLocation(spot);
                  }}
                  className="mt-2.5 flex items-center gap-1 text-[11px] font-sans font-semibold text-[#5A5A40] hover:underline"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{lang === 'hi' ? 'चिंतन शुरू करें' : 'Start Reflection'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Custom Spot Modal / Drawer */}
      {isAddingPlace && (
        <div className="mt-6 rounded-3xl border border-[#5A5A40]/30 bg-white p-6 shadow-sm font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e0d5]">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#5A5A40]" />
              <h3 className="text-sm font-bold text-[#4a4a3a]">
                {lang === 'hi' ? 'नया शांतिपूर्ण स्थान जोड़ें' : 'Tag a New Mindful Sanctuary'}
              </h3>
            </div>
            <button
              onClick={() => setIsAddingPlace(false)}
              className="text-xs text-[#7a7a6a] hover:text-[#4a4a3a]"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSaveCustomPlace} className="mt-4 space-y-3.5">
            <div className="text-xs text-[#7a7a6a]">
              {clickedLatLng ? (
                <span>
                  Coordinates selected: {clickedLatLng.lat.toFixed(4)}, {clickedLatLng.lng.toFixed(4)} (Click anywhere on the map to adjust)
                </span>
              ) : (
                <span>Click anywhere on the map to pin a location.</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4a4a3a] mb-1">
                  {lang === 'hi' ? 'स्थान का नाम' : 'Sanctuary Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quiet Lake Bench, Balcony Zen Corner"
                  value={newPlaceTitle}
                  onChange={(e) => setNewPlaceTitle(e.target.value)}
                  className="w-full rounded-full border border-[#d8d8cc] px-4 py-2 text-xs focus:border-[#5A5A40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a4a3a] mb-1">
                  {lang === 'hi' ? 'श्रेणी' : 'Category'}
                </label>
                <select
                  value={newPlaceCategory}
                  onChange={(e) => setNewPlaceCategory(e.target.value)}
                  className="w-full rounded-full border border-[#d8d8cc] px-4 py-2 text-xs focus:border-[#5A5A40] focus:outline-none bg-white"
                >
                  <option value="Personal Haven">Personal Haven</option>
                  <option value="Nature Trail">Nature Trail</option>
                  <option value="Zen Garden">Zen Garden</option>
                  <option value="Waterfront">Waterfront</option>
                  <option value="Meditation Hall">Meditation Hall</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4a4a3a] mb-1">
                {lang === 'hi' ? 'विवरण या शांति नोट' : 'Description / Serenity Note'}
              </label>
              <textarea
                rows={2}
                placeholder="What makes this space peaceful and grounding?"
                value={newPlaceDesc}
                onChange={(e) => setNewPlaceDesc(e.target.value)}
                className="w-full rounded-2xl border border-[#d8d8cc] p-3 text-xs focus:border-[#5A5A40] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingPlace(false)}
                className="rounded-full border border-[#d8d8cc] px-4 py-2 text-xs text-[#7a7a6a] hover:bg-[#ecece4]"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={!newPlaceTitle.trim() || !clickedLatLng}
                className="flex items-center gap-1.5 rounded-full bg-[#5A5A40] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#484833] disabled:opacity-50"
              >
                {saveSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>{lang === 'hi' ? 'सुरक्षित करें' : 'Save Sanctuary'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
