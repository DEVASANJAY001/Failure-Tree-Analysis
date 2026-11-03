import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Lesson } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const jsonPath = path.join(process.cwd(), 'lessons-data.json');
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: 'lessons-data.json not found' }, { status: 404 });
    }

    const data: Lesson[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const area = searchParams.get('area') || '';
    const project = searchParams.get('project') || '';

    let filtered = data;

    if (project && project !== 'all') {
      filtered = filtered.filter(l => l.project === project);
    }

    if (area && area !== 'all') {
      filtered = filtered.filter(l => l.area === area);
    }

    if (q) {
      filtered = filtered.filter(l => {
        const fullText = [
          'slide ' + l.slideNo,
          '#' + l.slideNo,
          l.docRef,
          l.project,
          l.area,
          l.concern,
          ...l.rootCauses,
          ...l.countermeasures,
          ...l.checkPoints,
        ].join(' ').toLowerCase();
        return fullText.includes(q);
      });
    }

    return NextResponse.json({
      total: data.length,
      count: filtered.length,
      lessons: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

