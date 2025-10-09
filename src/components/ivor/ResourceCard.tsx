import React from 'react';

interface Resource {
  id: string;
  name: string;
  description: string;
  organization: string;
  url?: string;
  phone?: string;
  email?: string;
  location: string;
  score?: number;
}

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="bg-liberation-cream border border-liberation-gold/20 rounded-lg p-3 mt-2 hover:border-liberation-gold transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-liberation-black text-sm">{resource.name}</h4>
          <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
        </div>
        {resource.score && (
          <div className="ml-2 px-2 py-1 bg-liberation-gold/20 rounded text-xs font-medium">
            {Math.round(resource.score * 100)}% match
          </div>
        )}
      </div>

      <div className="mt-2 space-y-1 text-xs">
        <p className="text-gray-700">
          <strong>Organization:</strong> {resource.organization}
        </p>
        <p className="text-gray-700">
          <strong>Location:</strong> {resource.location}
        </p>
        {resource.phone && (
          <p className="text-gray-700">
            <strong>Phone:</strong>{' '}
            <a href={`tel:${resource.phone}`} className="text-liberation-gold hover:underline">
              {resource.phone}
            </a>
          </p>
        )}
        {resource.email && (
          <p className="text-gray-700">
            <strong>Email:</strong>{' '}
            <a href={`mailto:${resource.email}`} className="text-liberation-gold hover:underline">
              {resource.email}
            </a>
          </p>
        )}
        {resource.url && (
          <p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-liberation-gold hover:underline font-medium inline-flex items-center"
            >
              Visit Website →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
