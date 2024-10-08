import React from 'react';
import { render, screen } from '@testing-library/react';
import Team from '../Team';
import { teamData } from '../../data/teamData';
import '@testing-library/jest-dom';

describe('Tests for <Team /> component', () => {
  beforeEach(() => {
    render(<Team />);
  });

  it('Shows the team description', () => {
    expect(
      screen.getByText(/Innovative team driving impactful solutions/i)
    ).toBeInTheDocument();
  });

  it('Shows each team member name', () => {
    teamData.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
    });
  });

  it('Shows each team member title', () => {
    teamData.forEach((member) => {
      expect(screen.getByText(member.title)).toBeInTheDocument();
    });
  });

  it('Shows each team member description', () => {
    teamData.forEach((member) => {
      expect(screen.getByText(member.description)).toBeInTheDocument();
    });
  });

  it('Shows each team member image', () => {
    teamData.forEach((member) => {
      expect(screen.getByAltText(`${member.name} photo`)).toBeInTheDocument();
    });
  });
});
