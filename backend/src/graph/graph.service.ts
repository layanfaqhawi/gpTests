import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import { GenerateGraphRequest } from 'src/typescript/generate-graph-request';

@Injectable()
export class GraphService {
  async generateGraph(request: GenerateGraphRequest) {
    const scriptPath = 'src/python/generate_graph.py';

    const payload = {
      config: {
        directed: request.config.data.directed,
        weighted: request.config.data.weighted,
        connected: request.config.data.connected,
        cyclic: request.config.data.cyclic,
      },
      num_nodes: request.num_nodes,
      num_edges: request.num_edges,
    };

    const stdout = await this.runPythonScript(scriptPath, payload);

    try {
      return JSON.parse(stdout);
    } catch {
      throw new InternalServerErrorException({
        message: 'Python returned non-JSON output.',
        raw: stdout,
      });
    }
  }

  private runPythonScript(scriptPath: string, payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const py = spawn('python', [scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let out = '';
      let err = '';

      py.stdout.on('data', (d) => (out += d.toString()));
      py.stderr.on('data', (d) => (err += d.toString()));

      py.on('error', (e) =>
        reject(
          new InternalServerErrorException(
            `Failed to start python: ${e.message}`,
          ),
        ),
      );

      py.on('close', (code) => {
        if (code !== 0) {
          // treat "impossible" as a bad request
          return reject(
            new InternalServerErrorException({
              message: err.trim() || `Python exited with code ${code}`,
              stderr: err,
              stdout: out,
              code,
            }),
          );
        }
        resolve(out.trim());
      });

      py.stdin.write(JSON.stringify(payload));
      py.stdin.end();
    });
  }
}
