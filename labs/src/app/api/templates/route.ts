import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Template } from '@/lib/models';

const defaultTemplates = [
  {
    name: 'E-commerce Platform',
    type: 'ecommerce',
    description: 'Full-featured online store with product management, cart, checkout, and payment integration',
    milestones: [
      { name: 'Discovery & Planning', description: 'Requirements gathering, wireframes, project roadmap', defaultPercentage: 15, order: 1 },
      { name: 'UI/UX Design', description: 'Visual design, mockups, design system', defaultPercentage: 20, order: 2 },
      { name: 'Frontend Development', description: 'User interface implementation', defaultPercentage: 25, order: 3 },
      { name: 'Backend Development', description: 'API, database, admin panel', defaultPercentage: 25, order: 4 },
      { name: 'Testing & QA', description: 'Quality assurance and bug fixes', defaultPercentage: 10, order: 5 },
      { name: 'Deployment & Launch', description: 'Production deployment and handoff', defaultPercentage: 5, order: 6 },
    ],
    estimatedDurationWeeks: 12,
    defaultPricing: { model: 'milestone', currency: 'USD', suggestedMin: 5000, suggestedMax: 15000 },
    suggestedTechnologies: { frameworks: ['Next.js', 'React', 'Tailwind CSS'], languages: ['TypeScript', 'Node.js'] },
    isDefault: true,
    isActive: true,
  },
  {
    name: 'SaaS Application',
    type: 'saas',
    description: 'Multi-tenant software as a service platform with subscription management',
    milestones: [
      { name: 'Discovery & Strategy', description: 'Market research, feature prioritization, architecture planning', defaultPercentage: 15, order: 1 },
      { name: 'Product Design', description: 'UX research, wireframes, UI design', defaultPercentage: 20, order: 2 },
      { name: 'MVP Development', description: 'Core feature implementation', defaultPercentage: 35, order: 3 },
      { name: 'Beta Testing', description: 'User testing, feedback integration', defaultPercentage: 15, order: 4 },
      { name: 'Launch & Scale', description: 'Production deployment, optimization', defaultPercentage: 15, order: 5 },
    ],
    estimatedDurationWeeks: 10,
    defaultPricing: { model: 'milestone', currency: 'USD', suggestedMin: 8000, suggestedMax: 25000 },
    suggestedTechnologies: { frameworks: ['Next.js', 'Prisma', 'Stripe'], languages: ['TypeScript', 'Node.js', 'PostgreSQL'] },
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Mobile App',
    type: 'mobile',
    description: 'Native or cross-platform mobile application for iOS and Android',
    milestones: [
      { name: 'UX/UI Design', description: 'App wireframes, visual design, prototypes', defaultPercentage: 20, order: 1 },
      { name: 'MVP Development', description: 'Core mobile features', defaultPercentage: 40, order: 2 },
      { name: 'Beta Testing', description: 'User testing on test devices', defaultPercentage: 20, order: 3 },
      { name: 'App Store Launch', description: 'Deployment to App Store and Play Store', defaultPercentage: 20, order: 4 },
    ],
    estimatedDurationWeeks: 8,
    defaultPricing: { model: 'milestone', currency: 'USD', suggestedMin: 6000, suggestedMax: 20000 },
    suggestedTechnologies: { frameworks: ['React Native', 'Expo'], languages: ['TypeScript', 'JavaScript'] },
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Landing Page',
    type: 'landing',
    description: 'Single-page marketing website with lead capture and conversion optimization',
    milestones: [
      { name: 'Design', description: 'Visual design and mockups', defaultPercentage: 40, order: 1 },
      { name: 'Development', description: 'Frontend implementation', defaultPercentage: 40, order: 2 },
      { name: 'Launch', description: 'Deployment and optimization', defaultPercentage: 20, order: 3 },
    ],
    estimatedDurationWeeks: 2,
    defaultPricing: { model: 'upfront', currency: 'USD', suggestedMin: 500, suggestedMax: 2000 },
    suggestedTechnologies: { frameworks: ['Next.js', 'Tailwind CSS'], languages: ['TypeScript'] },
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Web Application',
    type: 'webapp',
    description: 'Custom web application with user authentication and dynamic content',
    milestones: [
      { name: 'Discovery', description: 'Requirements and technical specification', defaultPercentage: 15, order: 1 },
      { name: 'Design', description: 'UI/UX design and prototypes', defaultPercentage: 20, order: 2 },
      { name: 'Development', description: 'Frontend and backend implementation', defaultPercentage: 40, order: 3 },
      { name: 'Testing', description: 'QA and bug fixes', defaultPercentage: 15, order: 4 },
      { name: 'Deployment', description: 'Production deployment', defaultPercentage: 10, order: 5 },
    ],
    estimatedDurationWeeks: 8,
    defaultPricing: { model: 'milestone', currency: 'USD', suggestedMin: 4000, suggestedMax: 12000 },
    suggestedTechnologies: { frameworks: ['Next.js', 'React'], languages: ['TypeScript', 'Node.js'] },
    isDefault: true,
    isActive: true,
  },
  {
    name: 'API / Backend',
    type: 'api',
    description: 'RESTful or GraphQL API with database design and documentation',
    milestones: [
      { name: 'Design', description: 'API specification and database schema', defaultPercentage: 25, order: 1 },
      { name: 'Development', description: 'API implementation', defaultPercentage: 45, order: 2 },
      { name: 'Documentation', description: 'API docs and integration guides', defaultPercentage: 15, order: 3 },
      { name: 'Deployment', description: 'API deployment and monitoring', defaultPercentage: 15, order: 4 },
    ],
    estimatedDurationWeeks: 6,
    defaultPricing: { model: 'milestone', currency: 'USD', suggestedMin: 3000, suggestedMax: 8000 },
    suggestedTechnologies: { frameworks: ['Express', 'Fastify', 'NestJS'], languages: ['TypeScript', 'Node.js', 'PostgreSQL'] },
    isDefault: true,
    isActive: true,
  },
];

export async function POST() {
  try {
    await connectDB();

    for (const template of defaultTemplates) {
      await Template.findOneAndUpdate(
        { type: template.type },
        template,
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: 'Templates seeded successfully' });
  } catch (error) {
    console.error('Seed templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const templates = await Template.find({ isActive: true }).sort({ name: 1 });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}