import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Cpu, Shield, Sparkles, MapPin } from "lucide-react";

export function LandingBento() {
  return (
    <section id="features" className="py-24 bg-background px-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-mono text-primary font-semibold uppercase tracking-wider mb-3">
            Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            A structured intelligence pipeline, not a generic dashboard.
          </h2>
          <p className="mt-3 text-base text-muted-foreground font-light leading-relaxed">
            Every citizen report is normalized, clustered with multi signal fusion, decomposed into required scientific capabilities, and verified by human officials.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Multi-Signal Fusion */}
          <div className="md:col-span-8 p-7 rounded-2xl bg-card border border-border flex flex-col justify-between hover:border-border/80 transition-all">
            <div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                Multi Signal Problem Fusion
              </h3>
              <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                Combines semantic text embeddings with PostGIS geographic proximity, temporal correlation, and domain compatibility to group scattered community reports into verified systemic issues.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Cosine + ST_Distance</span>
              <span className="text-primary font-medium">Confidence Weighted</span>
            </div>
          </div>

          {/* Card 2: Capability Decomposition */}
          <div className="md:col-span-4 p-7 rounded-2xl bg-card border border-border flex flex-col justify-between hover:border-border/80 transition-all">
            <div>
              <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-5">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                Capability Matching
              </h3>
              <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">
                Deconstructs problems into concrete engineering capabilities to match verified university labs.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border text-xs font-mono text-muted-foreground">
              40% Fit • 30% Proximity
            </div>
          </div>

          {/* Card 3: Deterministic Geospatial */}
          <div className="md:col-span-4 p-7 rounded-2xl bg-card border border-border flex flex-col justify-between hover:border-border/80 transition-all">
            <div>
              <div className="h-10 w-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center mb-5">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                Deterministic PostGIS
              </h3>
              <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">
                No hallucinated distances. Spatial radius calculations execute via PostgreSQL PostGIS geometry.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border text-xs font-mono text-muted-foreground">
              Zero AI Distance Estimation
            </div>
          </div>

          {/* Card 4: Verified Solution Memory */}
          <div className="md:col-span-8 p-7 rounded-2xl bg-card border border-border flex flex-col justify-between hover:border-border/80 transition-all">
            <div>
              <div className="h-10 w-10 rounded-xl bg-semantic-up/10 text-semantic-up flex items-center justify-center mb-5">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                Solution Memory & Impact Verification
              </h3>
              <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                Successful field pilot outcomes are permanently stored in vector memory with baseline measurements, intervention steps, and verified evidence for instant reuse across districts.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Baseline vs Outcome Tracking</span>
              <span className="text-semantic-up font-medium">Verified Records</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
