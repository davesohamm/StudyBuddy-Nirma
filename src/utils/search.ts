import { Course, SearchResult, CourseSyllabus, SyllabusUnit, CourseExperiment } from '@/types';

export class SearchService {
  private courses: Course[];

  constructor(courses: Course[]) {
    this.courses = courses;
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

    // Search through courses
    this.courses.forEach(course => {
      results.push(...this.searchInCourse(course, searchTerms));
    });

    // Sort by relevance score
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 50); // Limit to top 50 results
  }

  private searchInCourse(course: Course, searchTerms: string[]): SearchResult[] {
    const results: SearchResult[] = [];

    // Search in course basic info
    const courseRelevance = this.calculateRelevance(
      [course.name, course.code, course.description || ''].join(' '),
      searchTerms
    );

    if (courseRelevance > 0) {
      results.push({
        id: `course-${course.id}`,
        type: 'course',
        title: course.name,
        description: course.description || '',
        courseCode: course.code,
        courseName: course.name,
        relevanceScore: courseRelevance,
        highlightedText: this.highlightText(course.name, searchTerms)
      });
    }

    // Search in syllabus if available
    if (course.syllabus && typeof course.syllabus === 'object') {
      results.push(...this.searchInSyllabus(course.syllabus, searchTerms, course));
    }

    return results;
  }

  private searchInSyllabus(syllabus: CourseSyllabus, searchTerms: string[], course: Course): SearchResult[] {
    const results: SearchResult[] = [];

    // Search in units
    syllabus.units.forEach(unit => {
      results.push(...this.searchInUnit(unit, searchTerms, course));
    });

    // Search in experiments
    syllabus.experiments.forEach(experiment => {
      results.push(...this.searchInExperiment(experiment, searchTerms, course));
    });

    // Search in references
    syllabus.references.forEach((reference, index) => {
      const relevance = this.calculateRelevance(reference, searchTerms);
      if (relevance > 0) {
        results.push({
          id: `ref-${course.id}-${index}`,
          type: 'reference',
          title: `Reference: ${reference.split(',')[0]}`,
          description: reference,
          courseCode: course.code,
          courseName: course.name,
          relevanceScore: relevance,
          highlightedText: this.highlightText(reference, searchTerms)
        });
      }
    });

    // Search in learning outcomes
    syllabus.courseLearningOutcomes.forEach((clo, index) => {
      const cloText = `${clo.clo}: ${clo.description}`;
      const relevance = this.calculateRelevance(cloText, searchTerms);
      if (relevance > 0) {
        results.push({
          id: `clo-${course.id}-${index}`,
          type: 'topic',
          title: clo.clo,
          description: clo.description,
          courseCode: course.code,
          courseName: course.name,
          relevanceScore: relevance,
          highlightedText: this.highlightText(clo.description, searchTerms)
        });
      }
    });

    return results;
  }

  private searchInUnit(unit: SyllabusUnit, searchTerms: string[], course: Course): SearchResult[] {
    const results: SearchResult[] = [];

    // Search in unit title and contents
    const unitText = `${unit.title} ${unit.contents}`;
    const relevance = this.calculateRelevance(unitText, searchTerms);

    if (relevance > 0) {
      results.push({
        id: `unit-${course.id}-${unit.unitNumber}`,
        type: 'unit',
        title: `${unit.unitNumber}: ${unit.title}`,
        description: unit.contents,
        courseCode: course.code,
        courseName: course.name,
        unitNumber: unit.unitNumber,
        relevanceScore: relevance,
        highlightedText: this.highlightText(unit.contents, searchTerms)
      });
    }

    // Search in unit topics
    unit.topics.forEach((topic, index) => {
      const topicRelevance = this.calculateRelevance(topic, searchTerms);
      if (topicRelevance > 0) {
        results.push({
          id: `topic-${course.id}-${unit.unitNumber}-${index}`,
          type: 'topic',
          title: topic,
          description: `Topic from ${unit.unitNumber}: ${unit.title}`,
          courseCode: course.code,
          courseName: course.name,
          unitNumber: unit.unitNumber,
          relevanceScore: topicRelevance,
          highlightedText: this.highlightText(topic, searchTerms)
        });
      }
    });

    return results;
  }

  private searchInExperiment(experiment: CourseExperiment, searchTerms: string[], course: Course): SearchResult[] {
    const results: SearchResult[] = [];

    // Search in experiment name and description
    const expText = `${experiment.name} ${experiment.description}`;
    const relevance = this.calculateRelevance(expText, searchTerms);

    if (relevance > 0) {
      results.push({
        id: `exp-${course.id}-${experiment.srNo}`,
        type: 'experiment',
        title: `Lab ${experiment.srNo}: ${experiment.name}`,
        description: experiment.description,
        courseCode: course.code,
        courseName: course.name,
        relevanceScore: relevance,
        highlightedText: this.highlightText(experiment.description, searchTerms)
      });
    }

    // Search in experiment topics
    experiment.topics.forEach((topic, index) => {
      const topicRelevance = this.calculateRelevance(topic, searchTerms);
      if (topicRelevance > 0) {
        results.push({
          id: `exp-topic-${course.id}-${experiment.srNo}-${index}`,
          type: 'topic',
          title: topic,
          description: `Lab topic from ${experiment.name}`,
          courseCode: course.code,
          courseName: course.name,
          relevanceScore: topicRelevance,
          highlightedText: this.highlightText(topic, searchTerms)
        });
      }
    });

    return results;
  }

  private calculateRelevance(text: string, searchTerms: string[]): number {
    const lowerText = text.toLowerCase();
    let score = 0;

    searchTerms.forEach(term => {
      const termRegex = new RegExp(term, 'gi');
      const matches = lowerText.match(termRegex);
      if (matches) {
        // Exact matches get higher score
        if (lowerText.includes(term)) {
          score += matches.length * 2;
        }
        // Partial matches get lower score
        score += matches.length;
      }
    });

    return score;
  }

  private highlightText(text: string, searchTerms: string[]): string {
    let highlighted = text;
    
    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });

    return highlighted;
  }

  // Quick search for autocomplete
  getQuickSuggestions(query: string): string[] {
    if (!query.trim() || query.length < 2) return [];

    const suggestions = new Set<string>();
    const lowerQuery = query.toLowerCase();

    this.courses.forEach(course => {
      // Add course names
      if (course.name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(course.name);
      }

      // Add course codes
      if (course.code.toLowerCase().includes(lowerQuery)) {
        suggestions.add(course.code);
      }

      // Add topics from syllabus
      if (course.syllabus && typeof course.syllabus === 'object') {
        course.syllabus.units.forEach(unit => {
          unit.topics.forEach(topic => {
            if (topic.toLowerCase().includes(lowerQuery)) {
              suggestions.add(topic);
            }
          });
        });

        course.syllabus.experiments.forEach(exp => {
          exp.topics.forEach(topic => {
            if (topic.toLowerCase().includes(lowerQuery)) {
              suggestions.add(topic);
            }
          });
        });
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }
}

// Singleton instance
let searchServiceInstance: SearchService | null = null;

export const getSearchService = (courses: Course[]): SearchService => {
  if (!searchServiceInstance) {
    searchServiceInstance = new SearchService(courses);
  }
  return searchServiceInstance;
};

export const updateSearchService = (courses: Course[]): SearchService => {
  searchServiceInstance = new SearchService(courses);
  return searchServiceInstance;
};

// Force update search service when courses data changes
export const refreshSearchService = () => {
  searchServiceInstance = null;
}; 