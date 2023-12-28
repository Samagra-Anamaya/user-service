import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryGeneratorService {
  constructor() { }

  queryUsersByApplicationId(applicationId: string): string {
    const query = {
      bool: {
        must: [
          {
            nested: {
              path: "registrations",
              query: {
                bool: {
                  must: [
                    {
                      match: {
                        "registrations.applicationId": applicationId
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
    return JSON.stringify(query);
  }

  queryUsersByApplicationIdAndQueryString(applicationId: string[], queryString: string): string {
    const query: any = {
      "bool": {
        "must": [{
          "nested": {
            "path": "registrations",
            "query": {
              "bool": {
                "must": this.createMatchTags(applicationId)
              }
            }
          }
        }]
      }
    }

    if (queryString) {
      query.bool.must.push(
        {
          "query_string": {
            "query": queryString
          }
        })
    }

    return JSON.stringify(query)
  }

  createMatchTags(arr: string[]): Array<{ match: any }> {
    let tags: Array<{ match: any }> = [];
    for (let x of arr) {
      tags.push(
        {
          match: {
            "registrations.applicationId": x
          }
        }
      )
    }
    return tags;
  }
}
