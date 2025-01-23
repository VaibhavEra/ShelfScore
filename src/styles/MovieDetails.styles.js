import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #111827;
  text-gray-100;
  padding: 1rem 1.5rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #60a5fa;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  
  &:hover {
    color: #93c5fd;
  }
`;

export const Content = styled.div`
  display: grid;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 400px 1fr;
  }
`;

export const PosterWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  @media (min-width: 768px) {
    margin: 0;
  }
`;

export const Poster = styled.img`
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`;

export const Year = styled.span`
  font-size: 1.5rem;
  color: #9ca3af;
  font-weight: normal;
`;

export const Overview = styled.p`
  font-size: 1.125rem;
  line-height: 1.75;
  color: #f3f4f6;
  margin: 0;
`;

export const MetadataBox = styled.div`
  background-color: #1f2937;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
`;

export const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const GenreTag = styled.span`
  background-color: #374151;
  color: #d1d5db;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
`;

export const Tagline = styled.p`
  color: #9ca3af;
  font-style: italic;
  margin: 0;
  font-size: 1.125rem;
`;

export const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
`;

export const SuccessMessage = styled.div`
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  background: #059669;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  animation: slideIn 0.3s ease-out;
  z-index: 1000;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`; 