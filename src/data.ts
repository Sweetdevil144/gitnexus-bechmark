export const DATA = {
  "rows": [
    {
      "tool": "cubic-v2",
      "f1": 0.578,
      "p": 0.578,
      "r": 0.578,
      "tp": 100,
      "fp": 73,
      "fn": 73,
      "perPR": 3.46,
      "ours": false,
      "rank": 1
    },
    {
      "tool": "gitnexus",
      // v35 judged candidates after restoring drops and applying the drop rule.
      // Compute the metrics from TP=107, FP=91, FN=66; round only for display.
      "f1": (2 * 107) / (2 * 107 + 91 + 66),
      "p": 107 / (107 + 91),
      "r": 107 / (107 + 66),
      "tp": 107,
      "fp": 91,
      "fn": 66,
      "perPR": (107 + 91) / 50,
      "ours": true,
      "rank": 2
    },
    {
      "tool": "qodo-extended-v2",
      "f1": 0.5714,
      "p": 0.589,
      "r": 0.5549,
      "tp": 96,
      "fp": 67,
      "fn": 77,
      "perPR": 3.26,
      "ours": false,
      "rank": 3
    },
    {
      "tool": "augment",
      "f1": 0.543,
      "p": 0.5075,
      "r": 0.5838,
      "tp": 101,
      "fp": 98,
      "fn": 72,
      "perPR": 3.98,
      "ours": false,
      "rank": 4
    },
    {
      "tool": "qodo-v2",
      "f1": 0.5282,
      "p": 0.4747,
      "r": 0.5954,
      "tp": 103,
      "fp": 114,
      "fn": 70,
      "perPR": 4.34,
      "ours": false,
      "rank": 5
    },
    {
      "tool": "bugbot",
      "f1": 0.4762,
      "p": 0.5282,
      "r": 0.4335,
      "tp": 75,
      "fp": 67,
      "fn": 98,
      "perPR": 2.84,
      "ours": false,
      "rank": 6
    },
    {
      "tool": "gitlab",
      "f1": 0.4713,
      "p": 0.4686,
      "r": 0.474,
      "tp": 82,
      "fp": 93,
      "fn": 91,
      "perPR": 3.5,
      "ours": false,
      "rank": 7
    },
    {
      "tool": "devin",
      "f1": 0.4685,
      "p": 0.5929,
      "r": 0.3873,
      "tp": 67,
      "fp": 46,
      "fn": 106,
      "perPR": 2.26,
      "ours": false,
      "rank": 8
    },
    {
      "tool": "greptile-v4-1",
      "f1": 0.4654,
      "p": 0.4468,
      "r": 0.4855,
      "tp": 84,
      "fp": 104,
      "fn": 89,
      "perPR": 3.76,
      "ours": false,
      "rank": 9
    },
    {
      "tool": "gemini-v2",
      "f1": 0.4518,
      "p": 0.4027,
      "r": 0.5145,
      "tp": 89,
      "fp": 132,
      "fn": 84,
      "perPR": 4.42,
      "ours": false,
      "rank": 10
    },
    {
      "tool": "copilot-v2",
      "f1": 0.4513,
      "p": 0.3516,
      "r": 0.6301,
      "tp": 109,
      "fp": 201,
      "fn": 64,
      "perPR": 6.2,
      "ours": false,
      "rank": 11
    },
    {
      "tool": "macroscope",
      "f1": 0.4401,
      "p": 0.5,
      "r": 0.3931,
      "tp": 68,
      "fp": 68,
      "fn": 105,
      "perPR": 2.72,
      "ours": false,
      "rank": 12
    },
    {
      "tool": "sourcery",
      "f1": 0.4311,
      "p": 0.3805,
      "r": 0.4971,
      "tp": 86,
      "fp": 140,
      "fn": 87,
      "perPR": 4.52,
      "ours": false,
      "rank": 13
    },
    {
      "tool": "claude-code",
      "f1": 0.4164,
      "p": 0.4226,
      "r": 0.4104,
      "tp": 71,
      "fp": 97,
      "fn": 102,
      "perPR": 3.36,
      "ours": false,
      "rank": 14
    },
    {
      "tool": "kodus-v2",
      "f1": 0.4086,
      "p": 0.5377,
      "r": 0.3295,
      "tp": 57,
      "fp": 49,
      "fn": 116,
      "perPR": 2.12,
      "ours": false,
      "rank": 15
    },
    {
      "tool": "coderabbit",
      "f1": 0.4062,
      "p": 0.3068,
      "r": 0.6012,
      "tp": 104,
      "fp": 235,
      "fn": 69,
      "perPR": 6.78,
      "ours": false,
      "rank": 16
    },
    {
      "tool": "greptile-v5",
      "f1": 0.3938,
      "p": 0.3568,
      "r": 0.4393,
      "tp": 76,
      "fp": 137,
      "fn": 97,
      "perPR": 4.26,
      "ours": false,
      "rank": 17
    },
    {
      "tool": "claude",
      "f1": 0.3927,
      "p": 0.4114,
      "r": 0.3757,
      "tp": 65,
      "fp": 93,
      "fn": 108,
      "perPR": 3.16,
      "ours": false,
      "rank": 18
    },
    {
      "tool": "baz",
      "f1": 0.3767,
      "p": 0.4622,
      "r": 0.3179,
      "tp": 55,
      "fp": 64,
      "fn": 118,
      "perPR": 2.38,
      "ours": false,
      "rank": 19
    },
    {
      "tool": "copilot",
      "f1": 0.3357,
      "p": 0.2466,
      "r": 0.5255,
      "tp": 72,
      "fp": 220,
      "fn": 65,
      "perPR": 5.84,
      "ours": false,
      "rank": 20
    },
    {
      "tool": "codeant-v2",
      "f1": 0.3231,
      "p": 0.3118,
      "r": 0.3353,
      "tp": 58,
      "fp": 128,
      "fn": 115,
      "perPR": 3.72,
      "ours": false,
      "rank": 21
    },
    {
      "tool": "kg",
      "f1": 0.2294,
      "p": 0.5556,
      "r": 0.1445,
      "tp": 25,
      "fp": 20,
      "fn": 148,
      "perPR": 0.9,
      "ours": false,
      "rank": 22
    },
    {
      "tool": "graphite",
      "f1": 0.117,
      "p": 0.7333,
      "r": 0.0636,
      "tp": 11,
      "fp": 4,
      "fn": 162,
      "perPR": 0.3,
      "ours": false,
      "rank": 23
    }
  ],
  "corpus": [
    {
      "repo": "cal.com",
      "prs": 10
    },
    {
      "repo": "grafana",
      "prs": 10
    },
    {
      "repo": "discourse",
      "prs": 10
    },
    {
      "repo": "keycloak",
      "prs": 10
    },
    {
      "repo": "sentry",
      "prs": 10
    }
  ],
  "meta": {
    "prs": 50,
    "goldens": 173,
    "scored": 173,
    "tools": 22,
    "judge": "gpt-5.2",
    "temp": 0,
    "seed": 42,
    "reviewer": "two independent passes, one claim per comment",
    "profile": "all",
    "fbeta": "F1",
    "precisionRank": 6,
    "noiseReplay": 0.011,
    "noiseRegen": 0.054,
    "n": 5,
    "f1Mean": 0.5537,
    "f1Sem": 0.0049,
    "f1Sd": 0.011
  },
  "likeForLike": [
    { "tool": "cubic-v2",         "n": 5, "tp": 98.4,  "fp": 72.4,  "p": 0.5763, "r": 0.5688, "f1": 0.5725, "sem": 0.0058, "published": 0.5780, "ours": false },
    { "tool": "qodo-extended-v2", "n": 5, "tp": 94.8,  "fp": 69.8,  "p": 0.5761, "r": 0.5480, "f1": 0.5617, "sem": 0.0061, "published": 0.5714, "ours": false },
    { "tool": "gitnexus",         "n": 5, "tp": 96.0,  "fp": 77.8,  "p": 0.5524, "r": 0.5549, "f1": 0.5537, "sem": 0.0049, "published": null,   "ours": true  },
    { "tool": "augment",          "n": 5, "tp": 100.0, "fp": 101.0, "p": 0.4975, "r": 0.5780, "f1": 0.5348, "sem": 0.0021, "published": 0.5430, "ours": false },
    { "tool": "qodo-v2",          "n": 5, "tp": 97.6,  "fp": 115.4, "p": 0.4584, "r": 0.5642, "f1": 0.5058, "sem": 0.0034, "published": 0.5282, "ours": false }
  ]
} as const;
